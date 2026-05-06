# Authrex Helm chart

```bash
helm repo add aerofyta https://charts.aerofyta.health
helm repo update

# Install one cell
helm install authrex-cell0 aerofyta/authrex \
  --namespace authrex \
  --create-namespace \
  -f values-cell0.yaml \
  --set global.cellId=cell-0-apac-1 \
  --set global.region=ap-south-1
```

## Per-cell values files

| Cell | Values file | Region |
|---|---|---|
| `cell-0-apac-1` | `values-cell0.yaml` | ap-south-1 |
| `cell-1-us-1`   | `values-cell1.yaml` | us-east-1  |
| `cell-2-eu-1`   | `values-cell2.yaml` | eu-west-1  |

Each cell-specific values file overrides:
- `global.cellId` + `global.region`
- `serviceAccount.annotations.eks.amazonaws.com/role-arn` (cell-specific IRSA)
- `api.ingress.hosts[0].host` (cell-specific FQDN)
- `config.bedrockModelId` (per-region inference profile)
- `config.databaseReadUrl` (per-cell Aurora reader endpoint)

## What's templated

| Template | Resource |
|---|---|
| `_helpers.tpl`           | release-name + label helpers |
| `serviceaccount.yaml`    | IRSA-annotated SA |
| `api-deployment.yaml`    | API Deployment + Service + PDB |
| `worker-deployment.yaml` | Worker Deployment + KEDA ScaledObject |
| `ingress.yaml`           | ALB Ingress with TLS |
| `networkpolicy.yaml`     | deny-egress-default + allow-list |

## What's NOT in this chart (and why)

- **PgBouncer** — separate chart (`charts/pgbouncer`) per round-12 PROD-23
- **KEDA** — installed cluster-wide via Argo CD app `keda` (round 11)
- **Linkerd** — installed cluster-wide via Argo CD app `linkerd-control-plane`
- **Argo CD itself** — installed once at cluster bootstrap

This chart is the *application*, not the platform. Customers can install
Authrex on any compliant K8s cluster — the platform pre-reqs are documented
in the cluster-bootstrap README.

## Customer-facing security

The chart enforces:
- `runAsNonRoot` + `readOnlyRootFilesystem` + `seccompProfile: RuntimeDefault`
- NetworkPolicy: deny-egress-default + explicit allow-list (Postgres, Redis,
  Bedrock VPC endpoint, OTel collector)
- PodDisruptionBudget on api + worker (round 12 PROD-26)
- Linkerd auto-injection (mTLS pod-to-pod) per round 10 ADR
- terminationGracePeriodSeconds 90s — paired with `app/graceful_shutdown.py`

## When to retire / fork

- If you switch to AWS App Mesh / Istio: replace `linkerd.enabled` with the
  appropriate annotations.
- If you go AWS-fully-managed: replace `worker.keda.*` with EventBridge
  Pipes or AWS Lambda autoscaling.

## Sources

- Helm — https://helm.sh/
- AWS Load Balancer Controller — https://kubernetes-sigs.github.io/aws-load-balancer-controller/
- KEDA Postgres scaler — https://keda.sh/docs/latest/scalers/postgresql/
