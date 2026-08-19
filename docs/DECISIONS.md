# NomadIQ Architecture Decisions

This document records important technical and product decisions.

## Decision 001: Microservice-Oriented Architecture

Status: Accepted

NomadIQ will use a small number of domain-focused services.

Initial services:

- Gateway
- IdentityService
- DiscoveryService
- TripService
- AIService

Reason:

The project should demonstrate service boundaries without creating unnecessary microservices.

---

## Decision 002: No Separate Flight or Hotel Service in MVP

Status: Accepted

FlightService and HotelService will not be created initially.

Reason:

The MVP focuses on travel discovery and AI planning rather than becoming a full booking platform.

These services may be introduced later if real booking functionality is implemented.

---

## Decision 003: API Gateway

Status: Accepted

The frontend will communicate with backend services through the Gateway.

Reason:

- Single frontend entry point
- Centralized routing
- Future authentication integration
- Easier rate limiting
- Better service isolation

---

## Decision 004: JWT Authentication

Status: Accepted

Authentication will use JWT access tokens.

Refresh tokens may be added for long-lived sessions.

Reason:

JWT is suitable for distributed backend services and demonstrates common enterprise authentication architecture.

---

## Decision 005: Database Ownership

Status: Accepted

Services should own their data.

Services should not directly access another service's database.

Reason:

This preserves service boundaries and reduces coupling.

---

## Decision 006: PostgreSQL

Status: Accepted

PostgreSQL will be the primary relational database.

Entity Framework Core will be used for database access.

Reason:

- Free
- Production ready
- Strong relational support
- Excellent .NET integration

---

## Decision 007: AI Provider Abstraction

Status: Accepted

AI providers will be accessed through an abstraction.

Reason:

NomadIQ should not be tightly coupled to one AI provider.

Possible providers:

- Gemini
- Claude
- OpenAI

---

## Decision 008: Structured AI Responses

Status: Accepted

AI-generated trip plans should use structured data where possible.

Reason:

Structured data can be:

- Validated
- Rendered in the frontend
- Saved
- Edited
- Modified by AI

---

## Decision 009: Initial Service Communication

Status: Accepted

Services will initially communicate through HTTP APIs.

Reason:

This keeps the first implementation understandable.

Message queues and event-driven communication may be added later.

---

## Decision 010: Free or Low-Cost Deployment

Status: Accepted

The initial deployment should use free or low-cost services whenever possible.

Possible setup:

- Frontend: Netlify
- Backend: Render
- Database: Free-tier PostgreSQL provider
- Domain: Optional purchased domain

Azure will be explored separately and added later where practical.

---

## Decision 011: Architecture Will Evolve

Status: Accepted

The initial architecture is not considered final.

The project will evolve based on actual requirements.

Reason:

Good architecture evolves from real product needs rather than adding technology only for complexity.