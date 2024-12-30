## Sample Movie Manager App

This app has built with ```NestJS```,
deploy via ```Github-Action-Flows``` to ```Heroku```

## Description

Managers can add, remove and delete movies.
Movies have sessions and sessions have rooms and slots.
Users buy ticket and watch the movies at that session.

## Challenges
- ### Room double-booked conflict solved with MongoDB transactions

## Services

### User Registration and Login

- Users can sign in/up the system. 
- Authentication mechanism is Bearer JWT Token.
- Users can refresh their tokens.

## Manage Movies

This service protected with ```AuthGuard```.

- Managers can add, modify, and delete movies.
- Each movie has a
  name, age restriction, and multiple sessions.
- Each session should include a date, time
  slot, and room number.
 
## List Movies
- All users can view a list of available movies.
- Allow movie listings to be sorted and filtered by different fields (e.g., name, age
  restriction, etc.)

## Buy Tickets
- Customers can buy tickets for a specific movie session.

## Watch Movies
- Customers can watch movies for which they have a valid ticket.
- ```View Watch History```: Customers can view a list of movies they've watched.


