# Student Tasks - New Module Scenarios

Build each task as a new module from scratch. Reuse patterns from existing modules (`categories`, `products`, `orders`, `auth`).

## Scenario 1 - Reviews Module

- [ ] Create `reviews` module where customers can review products.
  - **Goal:** Practice new entity relations and guarded endpoints.
  - **Entities/Relations:** `Review` belongs to `User` and `Product`.
  - **Required fields:** `id`, `rating (1-5)`, `comment`, `userId`, `productId`, timestamps.
  - **Endpoints:**
    - `POST /reviews` (customer only)
    - `GET /reviews/product/:productId` (public)
    - `DELETE /reviews/:id` (review owner or admin)
  - **Must use:** DTOs, validation pipe, `JwtAuthGuard`, `RolesGuard`.
  - **Test checklist:** customer creates review, public can list product reviews, unauthorized create blocked.

## Scenario 2 - Coupons Module 

- [ ] Create `coupons` module for discount codes.
  - **Goal:** Practice admin-only CRUD + validation + expiration logic.
  - **Entity:** `Coupon` with `code`, `discountPercent`, `expiresAt`, `isActive`.
  - **Endpoints:**
    - `POST /coupons` (admin)
    - `GET /coupons` (admin)
    - `PATCH /coupons/:id` (admin)
    - `DELETE /coupons/:id` (admin)
  - **Business rules:**
    - `code` must be unique.
    - `discountPercent` must be between 1 and 90.
    - expired coupon cannot be activated.
  - **Must use:** DTOs, custom validation, exception handling with friendly errors.
  - **Test checklist:** duplicate code rejected, invalid discount rejected, admin-only access enforced.

## Scenario 3 - Wishlist Module

- [ ] Create `wishlist` module where each customer saves favorite products.
  - **Goal:** Practice many-to-many relation and user-scoped data.
  - **Relation:** `User` many-to-many `Product` through `WishlistItem` or join table.
  - **Endpoints:**
    - `POST /wishlist/:productId` (customer)
    - `GET /wishlist/me` (customer)
    - `DELETE /wishlist/:productId` (customer)
  - **Business rules:**
    - Same product cannot be added twice for same user.
    - Cannot add a product that does not exist.
  - **Must use:** param pipe for `productId`, DTO if needed, auth guard.
  - **Test checklist:** add/list/remove works; duplicate add blocked.

## Scenario 4 - Addresses Module

- [ ] Create `addresses` module for shipping addresses per user.
  - **Goal:** Practice nested validation and one-to-many relation.
  - **Relation:** `User (1) -> (N) Address`.
  - **Fields:** `city`, `street`, `building`, `postalCode`, `country`, `isDefault`.
  - **Endpoints:**
    - `POST /addresses` (customer)
    - `GET /addresses/me` (customer)
    - `PATCH /addresses/:id` (customer owner only)
    - `DELETE /addresses/:id` (customer owner only)
  - **Business rules:**
    - Only one default address per user.
    - User cannot edit/delete another user's address.
  - **Must use:** DTOs, auth guard, service-level ownership checks.
  - **Test checklist:** ownership enforced, default address rule works.

## Scenario 5 - Payments Module (Simple)

- [ ] Create `payments` module to simulate order payment.
  - **Goal:** Practice module integration with `orders`.
  - **Entity:** `Payment` with `orderId`, `amount`, `method`, `status`, `transactionRef`.
  - **Endpoints:**
    - `POST /payments/pay/:orderId` (customer owner of order)
    - `GET /payments/order/:orderId` (customer owner or admin)
  - **Business rules:**
    - Order can be paid only once.
    - Payment amount must equal order `totalPrice`.
    - On successful payment, update order status `pending -> paid`.
  - **Must use:** transaction-safe service logic (simple), exception filter for failures.
  - **Test checklist:** valid payment updates order, second payment attempt rejected.

## Scenario 6 - Notifications Module (Interceptor + Middleware Practice)

- [ ] Create `notifications` module for user notifications.
  - **Goal:** Practice cross-cutting concerns with module endpoints.
  - **Entity:** `Notification` with `userId`, `title`, `message`, `isRead`.
  - **Endpoints:**
    - `POST /notifications` (admin creates for a user)
    - `GET /notifications/me` (customer)
    - `PATCH /notifications/:id/read` (customer owner)
  - **Requirements:**
    - Add or reuse interceptor to return consistent response envelope.
    - Ensure middleware logs notification endpoints.
  - **Must use:** guards, DTOs, pipes, interceptor behavior.
  - **Test checklist:** admin can create; user can read own list and mark as read.
