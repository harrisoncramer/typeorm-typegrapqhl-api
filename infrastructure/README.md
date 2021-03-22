## The Cluster

### Provision Cluster

All of the files for configuring the cluster are contained in the `eksctl` folder. You should edit them to reflect the configuration required for your project.

To create the cluster, you'll need [eksctl](https://eksctl.io/) command line tool.

Provision with: `eksctl create cluster -f cluster.yaml`

### Access Management

Next, you'll need to setup access to the cluster for various IAM users. This will require you to configure both the IAM permissions and the RBAC (role-based access permissions) for the Kubernetes cluster.

First, you'll need to configure IAM access. This requires you to enter the userarn (unique identifer) that `eksctl` created when creating the cluster to the ConfigMap contained in the `aws-config.yaml` file. Then, you'll add each IAM user's information to the mapUsers section.

This [blog post](https://medium.com/swlh/secure-an-amazon-eks-cluster-with-iam-rbac-b78be0cd95c9) is helpful in understanding the difference between IAM/RBAC.

**Be careful not to accidentally restrict the IAM user that you want to give administrative access. If you do, you may have to recreate the cluster!** 😂

## The Database

By default, the application is not configured to connect to a local PostgresSQL instance, but rather connect to a managed external PostgresSQL instance, like [Amazon RDS](https://aws.amazon.com/rds/postgresql/) for PostgresSQL.

The connection configuration options are indicated in the `modules.d.ts` file. These should be configured prior to you setting up the containers.

## The Containers

First, in the root of your project, create the secret to pass to your production deployment from your dot file: `kubectl create secret generic typeorm-config --from-env-file .env.production`

Next, run the redis deployment: `kubectl apply -f infrastructure/redis.kube.yaml`

Inside the `deployment.kube.yaml` file, you'll need to replace `kingofcramers/typeorm` with the actual path to your repository on Docker Hub. Deploy the application (pulling from Docker hub image):

`kubectl apply -f infrastructure/deployment.kube.yaml`

### Redeploys

In order to redeploy an updated version of your application to production, you can rebuild it and then restart your application:

First, rebuild the image: `docker build . --tag yourDockerUsername/typeorm`

Then, restart the deployment: `kubectl rollout restart deployment typeorm`

### Secrets

You can change the production environment secrets, and then restart the server for them to take effect. First, update the secret:

`kubectl create secret generic typeorm-config --from-env-file .env.production --dry-run -o yaml | kubectl apply -f`

Then restart the deployment: `kubectl rollout restart deployment typeorm`
