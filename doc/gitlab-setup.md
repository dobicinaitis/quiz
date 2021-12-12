## GitLab setup
### Kubernetes integration
Setup Kubernetes cluster integration under Operations > Kubernetes menu

Connection page asks for:
* Cluster name > Which I got from the kube config file beside 'name’
* API URL > From kube config file beside 'server’
* CA Certificate (PEM) > From kube config file beside 'certificate-authority-data’ (then base64 decoded `base64 -d`)
* Token -> The token created for my admin-user account `kubectl describe secrets default-token-12345`
* Project namespace > quiz

## Manual docker image upload
Build image locally and push it to container registry
```shell
docker build -t registry.gitlab.com/dobicinaitis/quiz:latest .
docker push registry.gitlab.com/dobicinaitis/quiz:latest
```
