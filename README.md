# InfraLens Japan

**Bilingual (English / Japanese) AWS architecture assessment and learning platform.**

> ⚠️ **Project status: Early scaffold (Day 1 of 30).** Most features described below are **planned** and **not yet implemented**. This README will be updated as development progresses.

> This project is **not affiliated with, endorsed by, or sponsored by Amazon Web Services (AWS)**. It is an independent educational/portfolio project.

---

## Overview

InfraLens Japan is being built as a serious portfolio project to demonstrate practical cloud, infrastructure, full-stack, AWS, Terraform, security, and CI/CD skills for Cloud Engineer, Infrastructure Engineer, AWS Engineer, and Junior DevOps/Platform Engineer roles in Japan.

Users will be able to configure an AWS-style architecture and receive **explainable, rules-based feedback** — not random scores — about its reliability, security, cost-efficiency, performance, and operational maturity. The goal is to help engineers *understand architecture decisions*, not just memorize AWS service definitions.

## Purpose

This project is designed to demonstrate practical understanding of:

- AWS architecture & cloud networking
- High availability & fault tolerance
- AWS security best practices
- Monitoring & observability
- Infrastructure as Code (Terraform)
- CI/CD (GitHub Actions with OIDC)
- Cost optimization
- Application deployment
- Database design
- Frontend/backend integration
- Bilingual (EN/JA) application development

Every significant technical decision in this project is intended to be explainable in a technical interview (e.g. *why ECS Fargate over EC2*, *why RDS sits in private subnets*, *why Multi-AZ matters*, *why GitHub Actions uses OIDC instead of static AWS keys*).

## Planned Features

- 📊 **Dashboard** — architecture/assessment activity, score history *(planned)*
- 🏗️ **Architecture Analyzer** — configure AWS services (compute, database, storage, networking, delivery, security, monitoring, messaging) *(planned)*
- ✅ **Architecture Assessment** — deterministic, rules-based scoring (Reliability, Security, Cost Efficiency, Performance, Operations) *(planned)*
- 💡 **Recommendation Engine** — Critical / High Priority / Recommended / Consider, each with explanation and AWS concept *(implemented, Day 8)*
- 🗺️ **Architecture Visualization** — generated diagrams of traffic flow, AZs, public/private boundaries *(planned)*
- 💥 **Failure Simulator** — simulate EC2/ECS/RDS/AZ failures and see cascading impact *(planned)*
- ⚖️ **AWS Service Compare** — real architectural trade-offs (EC2 vs ECS vs Lambda, RDS vs DynamoDB, etc.) *(planned)*
- 💰 **Cost Calculator** — simplified JPY cost estimates, clearly labeled as sample data *(planned)*
- 📋 **Production Readiness Checklist** — security, reliability, monitoring, operations *(planned)*
- 🔐 **Authentication** — save architectures/assessments *(planned, future implementation)*

## Planned Technology Stack

**Frontend:** React 18, Vite, React Router v6, i18next, Chart.js, JavaScript (no TypeScript)
**Backend:** Node.js, Express, REST API, layered architecture (routes/controllers/services/repositories)
**Database:** PostgreSQL (Amazon RDS in production)
**Infrastructure as Code:** Terraform (modular, environment-separated: dev/prod)
**Cloud Provider:** AWS, primary region `ap-northeast-1` (Tokyo)
**CI/CD:** GitHub Actions, authenticating to AWS via **OIDC federation** (no static AWS access keys)

## Planned AWS Architecture

A high-level target architecture (subject to refinement as the project develops):

```
Frontend delivery:
User → Route 53 → CloudFront → S3 (static frontend)

Backend delivery:
User → ALB → ECS Fargate (backend API) → RDS PostgreSQL (private subnet, Multi-AZ)
```

Supporting services (planned): VPC with public/private subnets, Internet Gateway, NAT Gateway, IAM (least privilege), Secrets Manager, KMS, CloudWatch, ACM, WAF.

A detailed architecture diagram and Architecture Decision Records (ADRs) will be added under `docs/` as infrastructure decisions are made.

## Bilingual Support

The complete UI is planned to work in **English** and **Japanese**, using `i18next`. All user-facing sample data will be clearly labeled as **Sample Data / サンプルデータ**.

## Sample Data Disclaimer

All statistics, cost estimates, assessment histories, and usage figures shown in this application are **fictional sample data** created for demonstration purposes. They are **not real AWS pricing** and **not real customer data**. Any cost figures will be clearly labeled **"Sample Estimate / サンプル見積もり"**, and actual AWS pricing should always be verified against official AWS pricing pages.

## Project Status

| Area | Status |
|---|---|
| Repository scaffold | ✅ Done (Day 1) |
| Frontend setup (Vite, React Router, base layout) | ✅ Done (Day 2) |
| Design system & responsive shell | ✅ Done (Day 3) |
| Bilingual (i18next) | ✅ Done (Day 4) |
| Dashboard UI (stat cards, charts, sample data) | ✅ Done (Day 5) |
| Architecture Analyzer (service selector + configuration UI) | ✅ Done (Day 6) |
| Assessment rules engine (deterministic scoring) | ✅ Done (Day 7) |
| Recommendation engine | ✅ Done (Day 8) |
| Failure Simulator | ⏳ Not yet implemented |
| Backend / API | ⏳ Not yet implemented |
| Authentication | ⏳ Not yet implemented |
| Terraform infrastructure | ⏳ Not yet implemented |
| CI/CD (GitHub Actions + OIDC) | ⏳ Not yet implemented |

Development follows an incremental, day-by-day roadmap. See commit history and future documentation under `docs/` for progress.

## Repository Structure

```
infralens-japan/
├── frontend/          # React 18 + Vite (planned)
├── backend/           # Node.js + Express API (planned)
├── terraform/         # Infrastructure as Code (planned)
├── docs/              # Architecture docs, ADRs, security, deployment
├── .github/workflows/ # CI/CD pipelines (planned)
├── README.md
├── README.ja.md
├── LICENSE
└── .gitignore
```

## Author

**Naiem Naimur Rahman**
Based in Japan
AWS Certified Cloud Practitioner · Preparing for AWS Solutions Architect Associate

## License

This project is licensed under the [MIT License](./LICENSE).

Copyright © 2026 Naiem Naimur Rahman
