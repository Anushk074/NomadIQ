# NomadIQ Database Design

## Database Strategy

NomadIQ uses service ownership for data.

Each service is responsible for its own domain data.

The initial implementation should prioritize simplicity while keeping future microservice separation possible.

## IdentityService Database

Main entities:

### User

- Id
- FirstName
- LastName
- Email
- PasswordHash
- CreatedAt
- UpdatedAt

### RefreshToken

- Id
- UserId
- Token
- ExpiresAt
- CreatedAt
- RevokedAt

Relationship:

```text
User
  |
  | 1
  |
  | *
  v
RefreshToken


TripService Database
--------------------

Main entities:

### Trip

*   Id
    
*   UserId
    
*   Destination
    
*   StartDate
    
*   EndDate
    
*   Budget
    
*   Currency
    
*   TravelStyle
    
*   Status
    
*   CreatedAt
    
*   UpdatedAt
    

### ItineraryDay

*   Id
    
*   TripId
    
*   DayNumber
    
*   Date
    
*   Title
    
*   Notes
    

### Activity

*   Id
    
*   ItineraryDayId
    
*   Name
    
*   Description
    
*   Location
    
*   EstimatedCost
    
*   StartTime
    
*   EndTime
    

### TripBudget

*   Id
    
*   TripId
    
*   TotalBudget
    
*   FlightsBudget
    
*   AccommodationBudget
    
*   FoodBudget
    
*   TransportBudget
    
*   ActivitiesBudget
    
*   BufferBudget
    

Relationship:

Trip
 |
 +----------------+
 |                |
 v                v
ItineraryDay    TripBudget
 |
 v
Activity

Discovery Data
--------------

DiscoveryService may initially store:

*   Destination metadata
    
*   Country
    
*   City
    
*   Description
    
*   Tags
    
*   Average budget
    
*   Best travel months
    

External data such as weather and places may initially be retrieved through APIs.

AIService Data
--------------

AIService may store:

### Conversation

*   Id
    
*   UserId
    
*   TripId
    
*   CreatedAt
    
*   UpdatedAt
    

### ConversationMessage

*   Id
    
*   ConversationId
    
*   Role
    
*   Content
    
*   CreatedAt
    

Relationship:

Conversation
      |
      v
ConversationMessage

User Ownership Across Services
------------------------------

TripService and AIService may store UserId as a reference.

They do not own the User entity.

IdentityService
      |
      | UserId
      v
TripService
      |
      v
AIService

Database Technology
-------------------

Initial recommendation:

*   PostgreSQL
    
*   Entity Framework Core
    
*   Code First migrations
    

Reasons:

*   Free and open source
    
*   Production ready
    
*   Strong .NET support
    
*   Excellent for relational data
    

Important Rule
--------------

A service should not directly query another service's database.

Incorrect:

TripService
    |
    v
Identity Database

Correct:

TripService
    |
    v
IdentityService API

or, where only identity is needed:

JWT
 |
 v
UserId
 |
 v
TripService