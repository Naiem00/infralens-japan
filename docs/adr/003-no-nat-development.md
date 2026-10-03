# ADR 003: Avoid NAT Gateway During Development

## Status

Accepted for development

## Context

A NAT Gateway introduces continuous AWS cost.

## Decision

Do not create a NAT Gateway in the current development infrastructure.

ECS tasks currently use public IP connectivity while inbound application traffic
remains restricted by security groups to the Application Load Balancer.

## Consequences

This lowers development cost but is not the preferred final production architecture.

Production review should evaluate private ECS subnets with appropriate egress,
such as NAT or VPC endpoints.
