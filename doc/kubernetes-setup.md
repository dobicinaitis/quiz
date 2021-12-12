## Kubernetes setup
### Namespace
Kubernetes' namespaces help different projects, teams, or customers to share a Kubernetes cluster.

It does this by providing the following:
* A scope for Names.
* A mechanism to attach authorization and policy to a subsection of the cluster.

Let’s create a dedicated namespace for the application.

**namespace.yaml**
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: quiz
```
```shell
kubectl apply -f namespace.yaml
```
Now we can set this namespace as the default in kube config.
```shell
# set default namespace
kubectl config set-context $(kubectl config current-context) --namespace=quiz
```

### Secrets
#### Application properties
Properties used by the application (see [Environment variables](environment-variables.md)) are exposed to pods via environment variables.

These are stored as [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) and can be managed using a script `create-env-secrets-production.sh` which updates the Secrets in Kubernetes.
```shell
export VARIABLE_NAME=value
...

k8s/create-env-secrets-production.sh

# alternatively you can use variables stored in a setvar file
k8s/create-env-secrets-production.sh .setvar-docker-production
```
View saved Secrets
```shell
# requires:
# - jq
# - kubectl
# - base64

# usage: ./view-k8s-secret.sh secret_name key namespace

$ k8s/view-k8s-secret.sh quiz-env-production VARIABLE_NAME quiz
quiz
```

### Docker registry

Create a secret for access to GitLab docker registry.

This will require a GitLab access token with read registry rights for the Kubernetes cluster. The token can be created here: https://gitlab.com/profile/personal_access_tokens
```shell
export DOCKER_USERNAME=...
export DOCKER_PASSWORD=...
export DOCKER_EMAIL=...
export DOCKER_SERVER=...

k8s/create-docker-registry-secret.sh
```

### Deployment
A Deployment provides declarative updates for [Pods](https://kubernetes.io/docs/concepts/workloads/pods/) and [ReplicaSets](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/).

This will spin up a Jarvis pod instance in Kubernetes.

> If no images have been build in GitLab yet, then you can push one manually

```shell
docker build -t registry.gitlab.com/dobicinaitis/quiz:latest .
docker push registry.gitlab.com/dobicinaitis/quiz:latest
```

**deployment-production.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production-quiz-deployment
  namespace: quiz
  labels:
    app: quiz
spec:
  replicas: 1
  selector:
    matchLabels:
      app: quiz
  template:
    metadata:
      labels:
        environment: production
        app: quiz
    spec:
      containers:
      - name: quiz
        image: registry.gitlab.com/dobicinaitis/quiz:latest
        imagePullPolicy: Always
        envFrom:
        - secretRef:
            name: quiz-env-production
      imagePullSecrets:
      - name: gitlab-registry
```
```shell
kubectl apply -f deployment-production.yaml
```
At this point, you should see a pod being spun up and can check out if everything is working as intended using kubectl logs and exec commands.
```shell
$ kubectl --namespace=quiz get pods
NAME                                               READY   STATUS              RESTARTS   AGE
production-quiz-deployment-587d6c5944-8t4m2   0/1     ContainerCreating   0          16s

# a short time after
$ kubectl --namespace=quiz get pods
NAME                                               READY   STATUS    RESTARTS   AGE
production-quiz-deployment-587d6c5944-8t4m2   1/1     Running   0          61s

# view logs
kubectl --namespace=quiz logs -f production-quiz-deployment-587d6c5944-8t4m2
```
You can also forward a local port to a port on the Pod and access the system running in Kubernetes via http://localhost:8080 to verify that the service is actually available and works as intended.
```shell
[kubectl --namespace=quiz port-forward production-quiz-deployment-587d6c5944-8t4m2 8080:8080
]([]())```

### Service
Service is an abstract way to expose the application running on a set of Pods as a network service.

**service-production.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: production-quiz-service
  namespace: quiz
spec:
  selector:
    environment: production
    app: quiz
  ports:
    - name: http
      protocol: TCP
      port: 80
      targetPort: 8080
```
```shell
kubectl apply -f service-production.yaml
```

### Ingress
Finally, we can expose our service to the outside world. 
Ingress setup will make the system accessible via https://sh.luminor.dev and use a free 
Let's Encrypt SSL/TLS certificate that will be renewed auto-magically ([setup guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-with-cert-manager-on-digitalocean-kubernetes)).  
The HTTPS traffic will be forwarded to the internal HTTP port of our service.

**ingress.yaml**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: quiz-ingress
  namespace: quiz
  annotations:
    kubernetes.io/ingress.class: nginx
    kubernetes.io/tls-acme: "true"
    external-dns.alpha.kubernetes.io/hostname: luminor.dev
    cert-manager.io/cluster-issuer: letsencrypt-prod
    cert-manager.io/acme-challenge-type: http01
spec:
  tls:
    - hosts:
        - sh.luminor.dev
      secretName: letsencrypt-prod
  rules:
    - host: sh.luminor.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: production-quiz-service
                port:
                  number: 80
```
```shell
kubectl apply -f ingress.yaml
```
P.S. A DNS “A“ record forwarding sh.luminor.dev to Kubernetes load balancer needs to be set up prior for this to work  
😃

### Integration with GitLab
See [GitLab setup](gitlab-setup.md)

Addition setup to enable deployments from GitLab

**service-account.yaml**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: default
  namespace: quiz
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: gitlab-admin-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: deployment-reader
subjects:
- kind: ServiceAccount
  name: default
  namespace: quiz
```
```shell
kubectl apply -f service-account.yaml
```

**cluster-role.yaml**
```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: deployment-reader
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "watch", "list", "patch"]
```
```shell
kubectl apply -f cluster-role.yaml
```