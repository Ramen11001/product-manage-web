# product-manage-web

Application developed with Angular 16 for product management with a user commenting system. Uses Bootstrap 5 for styling and UI components.

## Core Technologies
- Angular 16
- Bootstrap 5
- TypeScript
- JSON Server (for development)
- RxJS (for state management)

## Main Views

### Authentication View
Login and registration screen where users can create an account or access the system. Includes form validation and credential handling.

### Profile View
Personal area where each user can:
- View their published products
- Check their posted comments
- Edit personal information (name, email and password)

### Product Listing View
Displays all available products in card format showing:
- Product name
- Price
- Average rating
- Main image

Includes:
- Name search functionality
- Price and rating filters
- Pagination for better performance

### Product Detail View
Full-screen display with complete product information:
- Full description
- Exact price
- Seller information
- Publication date

Comments section featuring:
- List of all comments
- Form to add new comments (requires authentication)
- 5-star rating system
