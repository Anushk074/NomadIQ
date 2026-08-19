# NomadIQ Architecture

## Overview

NomadIQ is an AI-powered travel planning platform built using a microservice-oriented architecture.

The frontend communicates with a single API Gateway. The Gateway routes requests to backend services.

```text
React Frontend
      |
      v
   Gateway
      |
      +------------------+
      |        |         |
      v        v         v
 Identity  Discovery    Trip
 Service    Service    Service
      |        |         |
      +--------+---------+
               |
               v
          AI Service

Backend Services
----------------

### Gateway

Responsibilities:

*   Single entry point for the frontend
    
*   Request routing
    
*   Authentication token forwarding
    
*   Future rate limiting
    
*   Future centralized logging
    

The frontend should not directly communicate with internal services in production.

### IdentityService

Responsibilities:

*   User registration
    
*   Login
    
*   JWT token generation
    
*   Refresh tokens
    
*   Password management
    
*   User identity
    

It owns authentication and authorization.

### DiscoveryService

Responsibilities:

*   Destination discovery
    
*   Destination information
    
*   Weather integration
    
*   Places and attractions
    
*   Travel recommendations
    
*   External travel data integration
    

It answers:

> Where should the user travel?

### TripService

Responsibilities:

*   Create trips
    
*   Save trips
    
*   Retrieve trips
    
*   Update trips
    
*   Delete trips
    
*   Store itineraries
    
*   Store budgets
    

It owns the user's trip data.

### AIService

Responsibilities:

*   Generate AI travel plans
    
*   Modify existing trips
    
*   Travel assistant conversations
    
*   AI orchestration
    
*   Combine data from other services
    
*   Return structured AI responses
    

The AIService should orchestrate data rather than contain all business data itself.

Service Communication
---------------------

Initial architecture:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Frontend      |      v  Gateway      |      +----------------------------+      |            |               |      v            v               v  Identity    Discovery          Trip  Service      Service          Service                    \            /                     \          /                      v        v                       AIService   `

Communication between services will initially use HTTP APIs.

Future improvements may include:

*   Message queues
    
*   Event-driven communication
    
*   Azure Service Bus
    
*   RabbitMQ
    
*   Background processing
    

These are not required for the initial MVP.

Database Ownership
------------------

Each service should logically own its own data.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   IdentityService        |        +-- Identity Database  DiscoveryService        |        +-- Discovery Data  TripService        |        +-- Trip Database  AIService        |        +-- AI Conversations / Metadata   `

The initial implementation may use PostgreSQL databases or a simplified shared local development setup.

Direct database access between services should be avoided.

Authentication Flow
-------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User    |    v  Frontend    |    v  IdentityService    |    v  JWT Token    |    v  Frontend    |    v  Gateway    |    v  Protected Backend Service   `

The JWT will contain user identity and relevant authorization claims.

Protected services validate the token before processing requests.

Architecture Principles
-----------------------

*   Keep service responsibilities clear
    
*   Avoid unnecessary microservices
    
*   Do not share service databases directly
    
*   Prefer API communication between services
    
*   Keep business logic inside the appropriate service
    
*   Keep AI orchestration separate from core trip persistence
    
*   Start simple and evolve when required