## Problem


## Implementation

This system models the domain with the following entities:

* **Customer**: Represents a client of the barbershop.
* **Barber**: Represents a barber with specialties and availability.
* **Appointment**: Represents a scheduled service between a customer and a barber, with validation to avoid conflicts.

## Features

* Register customers and barbers.
* Define barber specialties and weekly availability.
* Create appointments with conflict detection (no double booking).
* Cancel appointments respecting time restrictions.
* Value objects for strong typing and validation (e.g., Time, Service).

## Tech Stack

* Backend: Node.js, TypeScript, NestJS (optional)
* Testing: Vitest
* Date handling: date-fns

## Usage

* Add barbers with their specialties and availability.
* Customers can book appointments with available barbers.
* The system ensures no overlapping appointments for the same barber.
* Appointments can be canceled with business rules.
