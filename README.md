# InfraLens Japan

**An English/Japanese AWS architecture assessment and learning application, built as a cloud/infrastructure engineering portfolio project.**

**[GitHub repository](https://github.com/Naiem00/infralens-japan)** · **[日本語 README](README.ja.md)** · **[Architecture notes](docs/architecture.md)**

**Demo URL recorded in this repository:** https://d24vwnzgbvotf9.cloudfront.net
**Additional project homepage URL:** https://infralens-japan.vercel.app

> **Demo and deployment note:** The URLs above are project links; their current availability has not been independently confirmed during this documentation update. The repository includes substantial application code and Terraform configurations, but its infrastructure documentation says the full Terraform-managed AWS stack has **not been applied to production**. A public URL alone is not evidence that the complete AWS architecture below is deployed.
>
> This is an independent educational project and is **not affiliated with or endorsed by AWS**.

## What it does

InfraLens Japan allows users to explore AWS-style architecture choices and receive **deterministic, rules-based feedback** about design trade-offs. It is an educational simulator, not a production cloud audit or a real-time AWS account analyzer.

The application source includes:

| Feature | Status in the repository | Scope |
| --- | --- | --- |
| English / Japanese interface | ✅ Implemented | `i18next` and EN/JA resources |
| Dashboard and charts | ✅ Implemented | Clearly marked **sample** activity/score data |
| Architecture Analyzer | ✅ Implemented | Service selection, configuration and validation |
| Assessment engine | ✅ Implemented | Deterministic scoring rules |
| Recommendation engine | ✅ Implemented | Prioritized, explainable suggestions |
| Architecture diagram | ✅ Implemented | Generated visualization component |
| Failure Simulator | ✅ Implemented | Predefined demo architecture and selectable scenarios; **not** a live AWS fault-injection service |
| AWS Service Compare | ✅ Implemented | Educational comparisons and trade-offs |
| Cost Calculator | ✅ Implemented | Approximate **sample JPY estimates**, not the AWS Pricing API |
| Production Readiness | ✅ Implemented | Interactive checklist for security, reliability and operations |
| Express API and PostgreSQL access | ✅ Implemented in code | Live database operations not independently verified |
| Registration, login, saved architectures | ✅ Implemented in backend code | Production integration not independently verified |
| Terraform AWS resources | ✅ Configurations written | No verified `terraform apply` or full production rollout |
| GitHub Actions CI | ✅ Verified | Successful CI runs; see repository Actions history |
| GitHub OIDC workflow | 🚧 Plan workflow written | Manually triggered `terraform plan`; **no automated apply** |

## Stack

- **Frontend:** React 18, Vite, React Router 6, i18next, Chart.js
- **Backend:** Node.js, Express, JWT/bcrypt authentication, REST endpoints
- **Database:** PostgreSQL; AWS RDS is part of the proposed infrastructure
- **Infrastructure as Code:** Terraform (`infra/terraform/`)
- **Cloud design:** AWS VPC, public/private subnets, S3, CloudFront, ECR, ECS Fargate, ALB, RDS and CloudWatch
- **Automation:** GitHub Actions CI, plus an OIDC-authenticated Terraform **plan** workflow

## Application architecture

```text
React frontend (EN / JA)
   |-- Dashboard & charts (sample data)
   |-- Architecture assessment and recommendations
   |-- Failure simulator / service comparisons / sample costs
   |
   +---- REST API (Express)
               |
               +---- PostgreSQL (development / intended hosted database)
```

### Proposed AWS infrastructure (Terraform code; not a verified live deployment)

```text
Users -> CloudFront -> private S3 frontend bucket (OAC)
          |
          +-- /api/* -> public ALB -> ECS Fargate API -> private RDS PostgreSQL

VPC: public/private subnets across two AZs
Operations: CloudWatch logs/alarms, IAM task roles, encrypted storage
```

Terraform uses a simplified development network design. Its public ALB currently has an HTTP listener, and ECS networking needs additional production security review. See [architecture](docs/architecture.md) and [production-readiness review](docs/production-readiness.md). Never interpret the diagram as proof that all resources are currently deployed.

## Run locally

**Prerequisites:** Node.js 22+, npm, PostgreSQL (if testing API/database-backed features).

```bash
# Backend — separate terminal
cd backend
npm ci
cp .env.example .env
# Configure DATABASE_URL and JWT_SECRET before running
npm run db:migrate
npm run dev

# Frontend — from repository root, another terminal
cd frontend
npm ci
cp .env.example .env
npm run dev
```

The frontend's `VITE_API_BASE_URL` points to the backend API URL. Backend development settings are in [`backend/.env.example`](backend/.env.example); do not commit real secrets. Database migrations must be run against a database you control. The development-only JWT fallback must not be used in production.

## Verification

The repository has [GitHub Actions CI](.github/workflows/ci.yml) for the frontend, backend and Terraform checks. A successful past run is visible in [Actions history](https://github.com/Naiem00/infralens-japan/actions); it does not establish current production health.

```bash
# Backend (requires appropriate local setup)
cd backend
npm ci
npm run verify
node scripts/verifyAssessmentApi.mjs
node scripts/verifyAuth.mjs
node scripts/verifySavedArchitectures.mjs

# Frontend
cd ../frontend
npm ci
node scripts/verifyAssessment.mjs
node scripts/verifyRecommendations.mjs
node scripts/verifyFailureSimulator.mjs
node scripts/verifyServiceCompare.mjs
node scripts/verifyCostCalculator.mjs
node scripts/verifyVisualization.mjs
npm run build

# Terraform — config checks only; do not provision resources
cd ../infra/terraform
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

Running `terraform validate` does **not** create resources. Review IAM, HTTPS, persistent state, network placement and likely AWS costs before ever using `terraform apply`.

## Repository map

```text
infralens-japan/
├── frontend/             # React UI and simulation / scoring logic
├── backend/              # Express APIs, PostgreSQL migrations, auth
├── infra/
│   ├── terraform/        # Actual Terraform infrastructure configuration
│   └── bootstrap/        # Remote-state bucket bootstrap configuration
├── terraform/            # Reserved module/environment placeholders
├── docs/                 # Architecture, security, ADRs, deployment notes
├── .github/workflows/     # CI and manual Terraform plan workflow
├── README.md
└── README.ja.md
```

## Limits and next steps

- Scores, diagrams, failure outcomes and costs are **educational approximations**; the app does not inspect a customer's real AWS account.
- Dashboard figures are **sample data**, not live metrics from AWS services.
- The Terraform code is written and checked, but the documented full AWS deployment is **not complete/verified**.
- Production work remains: HTTPS/ACM, secure secrets, hardened IAM, durable state, infrastructure cost review, and end-to-end deployment validation.
- See [production-readiness notes](docs/production-readiness.md) for the detailed outstanding checklist.

## Developer

**Naiem Naimur Rahman** · Based in Japan
[AWS Certified Cloud Practitioner](https://www.credly.com/badges/6dc4e6f5-364e-42a1-be12-8cc826d5a990/public_url) · Preparing for Solutions Architect – Associate

## License

MIT — see [LICENSE](LICENSE). Copyright © 2026 Naiem Naimur Rahman.
