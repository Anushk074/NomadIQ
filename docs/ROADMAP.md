# NomadIQ — Development Roadmap

## Project Vision

NomadIQ is an AI-powered travel planning application.

The goal is to help users discover destinations, plan trips based on their
budget and preferences, generate personalized itineraries, and interact with
an AI assistant to modify and improve their trip.

Example:

> "I have ₹50,000 and 5 days. Plan a relaxing nature trip."

NomadIQ should eventually be able to:

- Recommend suitable destinations.
- Consider budget, duration, weather, and preferences.
- Generate personalized trip plans.
- Create day-by-day itineraries.
- Estimate trip expenses.
- Allow users to modify trips using natural language.
- Answer questions about the generated trip.

The project is also designed as a learning and portfolio project for:

- Modern .NET development.
- React and TypeScript.
- Microservices and system design.
- Authentication and security.
- AI and LLM integration.
- Docker and containerization.
- Distributed systems.
- Testing and observability.
- CI/CD and cloud deployment.

---

# Development Principles

NomadIQ will follow these principles:

1. Build a working product incrementally.
2. Prefer simple architecture until additional complexity is justified.
3. Do not introduce technology only for resume value.
4. Keep service boundaries based on responsibility and data ownership.
5. Prefer free or very low-cost infrastructure.
6. Keep external API dependencies optional where possible.
7. Keep secrets out of source control.
8. Document important architectural decisions.
9. Add tests as the project grows.
10. AI should interact with controlled application capabilities rather than
   directly accessing databases.

---

# Phase 0 — Project Foundation

## Goal

Set up the repository, development environment, initial solution, services,
documentation, and AI-assisted development workflow.

## Completed

- Git repository initialized.
- GitHub workflow established.
- WSL 2 configured.
- Node.js configured.
- .NET 10 SDK configured.
- Docker configured.
- Claude Code configured.
- Initial backend solution created.
- Initial backend services created.
- `.gitignore` created.
- Project documentation structure created.
- `CLAUDE.md` created.
- `GEMINI.md` created.

## Initial Backend Projects

- Gateway
- IdentityService
- TripService
- DiscoveryService
- AIService

## Status

**Completed**

---

# Phase 1 — Identity and Authentication

## Goal

Build secure user registration and authentication.

## Features

### User Registration

```http
POST /api/auth/register

### User Login

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST /api/auth/login   `

### JWT Authentication

The service should:

*   Validate user credentials.
    
*   Hash and securely store passwords.
    
*   Generate access tokens.
    
*   Include appropriate user claims.
    
*   Protect authenticated endpoints.
    

### Authorization

Implement the distinction between:

*   Authentication — Who is the user?
    
*   Authorization — What is the user allowed to do?
    

Technologies and Concepts
-------------------------

*   ASP.NET Core Web API.
    
*   C#.
    
*   Dependency Injection.
    
*   Middleware.
    
*   JWT.
    
*   Claims.
    
*   Password hashing.
    
*   EF Core.
    
*   SQL database.
    
*   Configuration.
    
*   Authentication and authorization.
    

Interview Concepts
------------------

*   JWT request flow.
    
*   Authentication middleware.
    
*   Authorization middleware.
    
*   ClaimsPrincipal.
    
*   Access tokens.
    
*   Refresh tokens.
    
*   Password hashing.
    
*   Dependency Injection.
    
*   ASP.NET Core request pipeline.
    

Definition of Done
------------------

A user can:

1.  Register.
    
2.  Login.
    
3.  Receive a JWT access token.
    
4.  Call a protected endpoint.
    
5.  Be rejected when the token is missing or invalid.
    

Phase 2 — Trip Management
=========================

Goal
----

Allow authenticated users to create and manage trips.

Initial Domain
--------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User    |    └── Trip          |          └── TripDay                |                └── Activity   `

Features
--------

*   Create a trip.
    
*   View all user trips.
    
*   View a specific trip.
    
*   Update a trip.
    
*   Delete a trip.
    
*   Create itinerary days.
    
*   Add activities.
    
*   Modify activities.
    

Initial APIs
------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   POST   /api/trips  GET    /api/trips  GET    /api/trips/{id}  PUT    /api/trips/{id}  DELETE /api/trips/{id}   `

Concepts
--------

*   REST APIs.
    
*   EF Core.
    
*   SQL.
    
*   DTOs.
    
*   Validation.
    
*   Service layer.
    
*   Entity relationships.
    
*   Data ownership.
    

Definition of Done
------------------

An authenticated user can create and manage a complete basic trip anditinerary.

Phase 3 — Destination Discovery
===============================

Goal
----

Help users discover destinations based on their travel requirements.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Budget: ₹50,000  Duration: 5 days  Preference: Nature  Travel Style: Relaxed  Weather Preference: Cool   `

NomadIQ should return suitable destinations.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1. Munnar  2. Manali  3. Coorg  4. Ooty   `

Initial Approach
----------------

Start with a controlled internal destination dataset.

The initial recommendation logic should use deterministic scoring based on:

*   Budget.
    
*   Duration.
    
*   Travel preferences.
    
*   Travel style.
    
*   Destination characteristics.
    
*   Weather and season information where available.
    

Later Integrations
------------------

Potential external providers:

*   Weather.
    
*   Places.
    
*   Hotels.
    
*   Flights.
    
*   Currency.
    

External APIs will only be added when they provide real value.

Concepts
--------

*   Service boundaries.
    
*   HTTP client integration.
    
*   External APIs.
    
*   Caching.
    
*   Recommendation logic.
    
*   Data normalization.
    
*   Resilience.
    

Definition of Done
------------------

A user can provide travel preferences and receive ranked destinationrecommendations.

Phase 4 — AI Trip Planner
=========================

Goal
----

Use AI to generate a personalized and structured travel itinerary.

Example:

> "I have ₹50,000 and 5 days. Plan a relaxing trip to Kerala."

The generated plan should include:

*   Destination.
    
*   Duration.
    
*   Estimated budget.
    
*   Day-by-day itinerary.
    
*   Activities.
    
*   Estimated expenses.
    
*   Travel recommendations.
    

Initial Architecture
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User    |    v  AI Service    |    v  AI Orchestrator    |    +---- Discovery Capability    |    +---- Trip Capability    |    +---- Weather Capability    |    v  AI Model    |    v  Structured Trip Plan   `

The AI should not directly access the database.

Instead, the AI interacts with controlled application capabilities.

Important Requirement
---------------------

Prefer structured responses rather than relying only on free-form AI text.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "destination": "Munnar",    "duration": 5,    "estimatedBudget": 42000,    "days": []  }   `

Concepts
--------

*   LLM integration.
    
*   Prompt design.
    
*   Structured output.
    
*   AI orchestration.
    
*   Tool calling.
    
*   AI validation.
    
*   Reliable AI applications.
    

Phase 5 — AI Travel Assistant
=============================

Goal
----

Allow users to modify and discuss an existing trip using natural language.

Examples:

> "Make Day 3 cheaper."

> "What if it rains?"

> "Add a vegetarian restaurant."

> "Remove expensive activities."

> "Can we fit another activity on Day 2?"

> "Make the whole trip ₹5,000 cheaper."

Architecture
------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User    |    v  AI Assistant    |    v  Understand User Intent    |    +---- Trip Capability    |    +---- Discovery Capability    |    +---- Weather Capability    |    v  Execute Controlled Action    |    v  Return Updated Result   `

Concepts
--------

*   AI agents.
    
*   Tool calling.
    
*   AI orchestration.
    
*   Context management.
    
*   State.
    
*   Guardrails.
    
*   AI and application integration.
    

Definition of Done
------------------

Users can use natural language to ask questions about and modify theirexisting trip.

Phase 6 — React Frontend
========================

Goal
----

Build the complete NomadIQ user interface.

Initial Screens
---------------

*   Landing page.
    
*   Registration.
    
*   Login.
    
*   Dashboard.
    
*   Explore destinations.
    
*   Destination details.
    
*   Trip planner.
    
*   My Trips.
    
*   Itinerary.
    
*   AI Assistant.
    

Technologies
------------

*   React.
    
*   TypeScript.
    
*   React Router.
    
*   API integration.
    
*   Forms and validation.
    
*   State management where justified.
    
*   Responsive UI.
    

Primary User Flow
-----------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Register     |     v  Login     |     v  Explore Destinations     |     v  Choose Destination     |     v  Create Trip     |     v  Generate Itinerary     |     v  Modify Itinerary Using AI   `

Definition of Done
------------------

A user can complete the main NomadIQ workflow through the browser.

Phase 7 — API Gateway and Distributed Architecture
==================================================

Goal
----

Introduce a controlled entry point for backend services.

Gateway Architecture
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    |    v  API Gateway    |    +---- Identity Service    |    +---- Trip Service    |    +---- Discovery Service    |    +---- AI Service   `

The initial gateway technology is expected to be:

*   YARP.
    

Concepts
--------

*   Reverse proxy.
    
*   API Gateway.
    
*   Routing.
    
*   Service boundaries.
    
*   Authentication propagation.
    
*   Rate limiting.
    
*   Service-to-service communication.
    

Definition of Done
------------------

The frontend communicates with backend services through the API Gateway whereappropriate.

Phase 8 — Docker and Local Infrastructure
=========================================

Goal
----

Make the application reproducible using containers.

Initial Container Architecture
------------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Docker Compose      |      +-- Gateway      +-- Identity Service      +-- Trip Service      +-- Discovery Service      +-- AI Service      +-- Database   `

Potential Technologies
----------------------

*   Docker.
    
*   Docker Compose.
    
*   Redis.
    
*   Message broker.
    

Additional infrastructure will only be added when it solves a real problem.

Concepts
--------

*   Containers.
    
*   Images.
    
*   Dockerfiles.
    
*   Docker Compose.
    
*   Networking.
    
*   Environment variables.
    
*   Service dependencies.
    

Phase 9 — Asynchronous Communication
====================================

Goal
----

Introduce asynchronous communication where synchronous HTTP communication isnot appropriate.

Potential Events
----------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   TripCreated  TripUpdated  TripPlanGenerated  NotificationRequested   `

Possible Architecture
---------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Trip Service       |       v  Message Broker       |       +---- AI Processing       |       +---- Notifications       |       +---- Analytics   `

The exact technology will be selected later based on:

*   Cost.
    
*   Complexity.
    
*   Learning value.
    
*   Real project requirements.
    

Concepts
--------

*   Event-driven architecture.
    
*   Message brokers.
    
*   Queues.
    
*   Pub/Sub.
    
*   Eventual consistency.
    
*   Retry handling.
    
*   Idempotency.
    

Phase 10 — Testing
==================

Goal
----

Build confidence in the system through automated testing.

Unit Testing
------------

Test:

*   Business logic.
    
*   Recommendation logic.
    
*   Validation.
    
*   Authentication-related logic.
    
*   AI orchestration logic.
    

Integration Testing
-------------------

Test:

*   APIs.
    
*   Database interactions.
    
*   Authentication.
    
*   Service interactions.
    

End-to-End Testing
------------------

Test important user workflows.

Concepts
--------

*   Unit testing.
    
*   Integration testing.
    
*   Mocking.
    
*   Test doubles.
    
*   API testing.
    
*   Test containers where appropriate.
    

Phase 11 — Observability
========================

Goal
----

Understand what is happening across the application.

Features
--------

*   Structured logging.
    
*   Global error handling.
    
*   Health checks.
    
*   Metrics.
    
*   Distributed tracing.
    
*   Correlation IDs.
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Request    |    v  Gateway    |    v  Trip Service    |    v  Database   `

A correlation ID should eventually help trace the same request acrossmultiple components.

Concepts
--------

*   Logging.
    
*   Monitoring.
    
*   Distributed tracing.
    
*   Diagnostics.
    
*   Production troubleshooting.
    

Phase 12 — Deployment and CI/CD
===============================

Goal
----

Deploy a live portfolio version while keeping infrastructure costs as closeto zero as practical.

Requirements
------------

*   Free-tier or low-cost hosting.
    
*   HTTPS.
    
*   Environment variables.
    
*   Secret management.
    
*   CI/CD.
    
*   Frontend deployment.
    
*   Backend deployment.
    
*   Database deployment.
    
*   Custom domain if desired.
    

Potential hosting platforms will be evaluated later.

Azure remains a learning target, but NomadIQ should not depend on expensivepaid Azure services when free alternatives are sufficient.

Concepts
--------

*   CI/CD.
    
*   GitHub Actions or Azure DevOps.
    
*   Environment configuration.
    
*   Deployment.
    
*   Production configuration.
    
*   Secrets.
    
*   Domains and DNS.
    

Phase 13 — Portfolio and Production Polish
==========================================

Goal
----

Turn NomadIQ into a strong portfolio and interview project.

Deliverables
------------

*   Public GitHub repository.
    
*   Live application.
    
*   Complete README.
    
*   Architecture diagram.
    
*   API documentation.
    
*   Setup instructions.
    
*   Deployment documentation.
    
*   Screenshots.
    
*   Demo video if useful.
    
*   CI/CD pipeline.
    
*   Testing documentation.
    
*   Technical decision records.
    

Final Interview Topics
----------------------

NomadIQ should provide practical experience discussing:

*   ASP.NET Core.
    
*   C#.
    
*   REST APIs.
    
*   JWT.
    
*   Middleware.
    
*   Authentication and authorization.
    
*   EF Core.
    
*   SQL.
    
*   React.
    
*   TypeScript.
    
*   Microservices.
    
*   API Gateway.
    
*   Docker.
    
*   CI/CD.
    
*   Cloud deployment.
    
*   Distributed systems.
    
*   Caching.
    
*   Messaging.
    
*   AI orchestration.
    
*   System design.
    

MVP Boundary
============

The first complete version of NomadIQ should contain:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Authentication        +  Trip Management        +  Destination Discovery        +  AI Trip Planner        +  AI Travel Assistant        +  React Frontend   `

The following are intentionally outside the initial MVP:

*   Real flight booking.
    
*   Real hotel booking.
    
*   Payment processing.
    
*   Flight price prediction.
    
*   Real-time flight tracking.
    
*   Complex machine learning recommendation models.
    
*   Social networking.
    
*   Mobile application.
    

These may become future extensions after the MVP is stable.

Development Workflow
====================

Each major feature should follow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Requirement      |      v  Architecture Decision      |      v  Documentation      |      v  Implementation      |      v  Testing      |      v  Review      |      v  Git Commit   `

AI Tool Responsibilities
========================

ChatGPT
-------

Primary responsibilities:

*   Product planning.
    
*   Architecture.
    
*   System design.
    
*   Technical explanations.
    
*   Learning and mentoring.
    
*   Interview preparation.
    
*   Reviewing technical decisions.
    

Claude Code
-----------

Primary responsibilities:

*   Repository inspection.
    
*   Implementation.
    
*   Refactoring.
    
*   Tests.
    
*   Build and code-level analysis.
    
*   Applying approved architectural decisions.
    

Claude should not independently redefine major architecture or productrequirements without discussion.

Gemini
------

Primary responsibilities:

*   Technology research.
    
*   API research.
    
*   Pricing and free-tier verification.
    
*   Independent technical review.
    
*   Challenging architectural assumptions.
    
*   Evaluating current technology options.
    

Developer
---------

The developer makes the final decisions.

AI assistants should support the developer rather than independently controlthe project.