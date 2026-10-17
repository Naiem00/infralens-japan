# InfraLens Japan

**AWSのアーキテクチャを学習・評価する、日英バイリンガル対応の個人開発アプリケーションです。** クラウド／インフラエンジニアを目指すための学習・ポートフォリオプロジェクトとして作成しています。

**[GitHub](https://github.com/Naiem00/infralens-japan)** · **[English README](README.md)** · **[アーキテクチャ資料](docs/architecture.md)**

**リポジトリに記載されているデモURL：** https://d24vwnzgbvotf9.cloudfront.net
**プロジェクトのホームページURL：** https://infralens-japan.vercel.app

> **公開・デプロイ状況について：** 上記URLの現在の稼働状況は、本ドキュメント更新時に独立して確認できていません。アプリケーションの実装コードとTerraformの定義ファイルは存在しますが、リポジトリ内のインフラ資料によると、**Terraformで定義したAWS環境全体の本番デプロイは未完了**です。URLが存在することと、全AWSリソースの構築完了は別のことです。
>
> 本プロジェクトは個人の学習用プロジェクトであり、AWSによる承認・後援を受けたものではありません。

## 概要

AWSを想定した構成を選択し、信頼性・セキュリティ・コスト効率・性能・運用について、**ルールに基づく説明可能な診断と改善提案**を表示します。実際のAWSアカウントを自動監査するサービスではなく、設計判断を学ぶ教育用シミュレーターです。

## 実装状況

| 機能 | ソースコード上の状況 | 補足 |
| --- | --- | --- |
| 日本語／英語の切り替え | ✅ 実装済み | i18nextと翻訳リソース |
| ダッシュボードとグラフ | ✅ 実装済み | **サンプルデータ**を表示 |
| アーキテクチャアナライザー | ✅ 実装済み | サービス選択・構成・入力検証 |
| 診断スコアリング | ✅ 実装済み | 決定論的ルールエンジン |
| 改善提案エンジン | ✅ 実装済み | 優先度と理由を提示 |
| アーキテクチャ可視化 | ✅ 実装済み | 図を表示するコンポーネント |
| 障害シミュレーター | ✅ 実装済み | 固定デモ構成を用いたシミュレーション（実AWSへの障害注入ではありません） |
| AWSサービス比較 | ✅ 実装済み | 学習用の比較表 |
| コスト計算機 | ✅ 実装済み | **サンプル料金による概算**（AWS実料金APIは未使用） |
| 本番運用チェックリスト | ✅ 実装済み | セキュリティ・信頼性・運用 |
| Express API／PostgreSQL連携 | ✅ コード実装済み | 稼働中のDB接続は未検証 |
| 認証・保存アーキテクチャ | ✅ バックエンドコード実装済み | 本番環境との統合は未検証 |
| Terraform AWSインフラ定義 | ✅ 記述済み | `terraform apply` の実行・本番展開は未確認 |
| GitHub Actions CI | ✅ 実行履歴を確認 | 成功したCI実行履歴あり |
| OIDCによるTerraform実行 | 🚧 計画用Workflowあり | `terraform plan` のみ。自動 `apply` はありません |

## 使用技術

- **フロントエンド：** React 18、Vite、React Router 6、i18next、Chart.js
- **バックエンド：** Node.js、Express、REST API、JWT／bcrypt
- **データベース：** PostgreSQL（AWS RDSはインフラ設計上の構成要素）
- **IaC：** Terraform（実際の定義ファイルは `infra/terraform/`）
- **AWS設計：** VPC、パブリック／プライベートサブネット、S3、CloudFront、ECR、ECS Fargate、ALB、RDS、CloudWatch
- **自動化：** GitHub Actions CI、OIDCを利用したTerraform **plan** ワークフロー

## アーキテクチャ

アプリケーションの概念図：

```text
Reactフロントエンド（日英対応）
  ├── ダッシュボード（サンプルデータ）
  ├── AWS構成診断・改善提案
  ├── 障害シミュレーター、サービス比較、概算コスト
  └── Express REST API
                 └── PostgreSQL（開発用／ホスティングを想定）
```

**Terraformに記述されているAWS構成案（全体の稼働確認は未完了）：**

```text
ユーザー → CloudFront → 非公開S3（OAC）
                |
                +→ /api/* → ALB → ECS Fargate API → 非公開RDS PostgreSQL

VPC：複数AZのパブリック／プライベートサブネット
運用：CloudWatch、IAMロール、ストレージ暗号化
```

開発用の簡略ネットワーク設計を採用しています。現状のALBリスナーはHTTPであり、本番運用前にHTTPS、ネットワーク、IAMなどのセキュリティ見直しが必要です。詳細は[アーキテクチャ資料](docs/architecture.md)と[本番運用の確認事項](docs/production-readiness.md)を参照してください。

## ローカルでの起動

**必要な環境：** Node.js 22+、npm、PostgreSQL（DB連携機能の確認時）。

```bash
# バックエンド（ターミナル1）
cd backend
npm ci
cp .env.example .env
# DATABASE_URL、JWT_SECRET等を設定してから実行
npm run db:migrate
npm run dev

# フロントエンド（リポジトリのルートから、ターミナル2）
cd frontend
npm ci
cp .env.example .env
npm run dev
```

環境変数の例は[`backend/.env.example`](backend/.env.example)と[`frontend/.env.example`](frontend/.env.example)にあります。秘密情報はGitにコミットしないでください。バックエンドの開発用JWTデフォルト値を本番で使用しないでください。

## テスト・検証

[GitHub Actions CI](.github/workflows/ci.yml)ではフロントエンド、バックエンド、Terraformの検証を定義しています。過去の成功履歴は[Actions](https://github.com/Naiem00/infralens-japan/actions)で確認できます。ただし、CI成功は本番環境の正常稼働を保証するものではありません。

```bash
# バックエンド（ローカル環境を適切に設定）
cd backend
npm ci
npm run verify
node scripts/verifyAssessmentApi.mjs
node scripts/verifyAuth.mjs
node scripts/verifySavedArchitectures.mjs

# フロントエンド
cd ../frontend
npm ci
node scripts/verifyAssessment.mjs
node scripts/verifyRecommendations.mjs
node scripts/verifyFailureSimulator.mjs
node scripts/verifyServiceCompare.mjs
node scripts/verifyCostCalculator.mjs
node scripts/verifyVisualization.mjs
npm run build

# Terraform（定義ファイルの検証のみ。AWSリソースは作成しません）
cd ../infra/terraform
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
```

`terraform validate` はAWSリソースを作成しません。`terraform apply` の前にIAM権限、HTTPS、状態ファイルの永続化、費用を十分に確認する必要があります。

## リポジトリ構成

```text
infralens-japan/
├── frontend/           # React UI／ルール・シミュレーション
├── backend/            # Express API、DB、認証
├── infra/
│   ├── terraform/      # 実際のTerraform定義ファイル
│   └── bootstrap/      # Terraform state用S3の定義
├── terraform/          # 今後のモジュール／環境分離用の雛形
├── docs/               # 設計資料、ADR、セキュリティ
├── .github/workflows/  # CIおよび手動Terraform plan
├── README.md
└── README.ja.md
```

## 制限事項と今後の課題

- 診断結果、図、障害の影響、費用は**学習用のモデル・概算**であり、実AWSアカウントの状態を分析していません。
- ダッシュボードの数値は**サンプルデータ**であり、実運用メトリクスではありません。
- Terraformの定義は記述・検証されていますが、AWS環境全体への展開は**未完了／未確認**です。
- 本番運用前にHTTPS／ACM、秘密情報管理、IAM最小権限、Terraform state管理、AWS費用・運用の確認が必要です。
- 詳細は[Production Readiness Review](docs/production-readiness.md)を参照してください。

## 開発者

**Naiem Naimur Rahman（ナイエム・ナイムル・ラーマン）** · 日本在住
[AWS認定クラウドプラクティショナー](https://www.credly.com/badges/6dc4e6f5-364e-42a1-be12-8cc826d5a990/public_url) 取得済み／AWS認定ソリューションアーキテクト – アソシエイト 学習中

## ライセンス

MITライセンス。[LICENSE](LICENSE) をご参照ください。Copyright © 2026 Naiem Naimur Rahman.
