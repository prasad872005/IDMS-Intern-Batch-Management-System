# IDMS – Intern & Batch Data Management System

A full-stack starter implementation of the Month 3 IDMS specification.

## Technology
- Backend: Java 17, Spring Boot 3.3, Spring Data JPA, Bean Validation
- Database: MySQL 8
- Frontend: Angular 18, Angular Material, Reactive Forms, HttpClient

## Features
- Create, list, update and delete interns
- Intern ID generated as `TDAyyyyMMdd-001` (Free) or `EMPyyyyMMdd-001` (Premium)
- Sequence is unique per joining date and ID-card type; generation is transaction-safe at service level
- Create batches; end date is calculated as six calendar months after start date
- Batch list includes intern count; batch detail shows assigned interns
- Search by name / intern ID / email, filter by batch and ID-card type
- Required batch assignment and email/mobile validation
- Responsive Angular dashboard

## Prerequisites
- JDK 17+
- Maven 3.9+
- Node.js 20.11+ and npm
- MySQL 8+

## 1. Database
Create a database (or let Spring create it):
```sql
CREATE DATABASE idms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Default local connection is `jdbc:mysql://localhost:3306/idms_db`, username `root`, password `root`.
Override with environment variables `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` if needed.

## 2. Start backend
```bash
cd backend
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api`
Health endpoint: `http://localhost:8080/api/health`

## 3. Start frontend
In another terminal:
```bash
cd frontend
npm install
npm start
```
Open `http://localhost:4200`.

## Main API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/interns` | List interns; optional `search`, `batchId`, `cardType` |
| GET | `/api/interns/{id}` | Get one intern |
| POST | `/api/interns` | Register intern |
| PUT | `/api/interns/{id}` | Update editable intern details (ID is immutable) |
| DELETE | `/api/interns/{id}` | Delete intern |
| GET | `/api/batches` | List batches with counts |
| GET | `/api/batches/{id}` | Batch and assigned interns |
| POST | `/api/batches` | Create batch (end date calculated by backend) |
| DELETE | `/api/batches/{id}` | Delete empty batch only |

### Example: create a batch
```json
{ "startDate": "2026-11-10" }
```
### Example: register an intern
```json
{
  "name": "Aarav Patil",
  "email": "aarav@example.com",
  "mobileNumber": "9876543210",
  "cardType": "PREMIUM",
  "dateOfJoining": "2026-11-10",
  "batchId": 1
}
```

## Notes
- The PDF specifies sequential three-digit IDs and says numbering should be sequential per batch. Since the requested ID format contains joining date and card type but no batch identifier, this implementation sequences by **joining date + card type**, which guarantees the displayed ID remains unique and follows the example format. If your evaluator expects numbering separately within each batch, update `InternService.generateInternId()` to include `batchId` in its sequence query (while retaining the required visible format).
- Batch end dates use `LocalDate.plusMonths(6)`; Java handles month-end dates safely.
- `ddl-auto=update` is enabled for local development. For production, use Flyway/Liquibase migrations and configure credentials securely.
- This project does not include authentication because it is not required in the supplied PDF.
