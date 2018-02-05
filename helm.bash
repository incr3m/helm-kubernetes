helm install --name helm-kube-lego   --set config.LEGO_EMAIL=ajcastelfaller@gmail.com,config.LEGO_URL=https://acme-v01.api.letsencrypt.org/directory     stable/kube-lego

helm install stable/nginx-ingress --name my-nginx