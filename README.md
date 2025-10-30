# ADVENTURELANE
>>>>>>> 142d2857e2396c8a181e29a4e25d622bd0246876
=======
# ADVENTURELANE

A complete fullstack travel experiences booking platform built with React, TypeScript, TailwindCSS, and Lovable Cloud (powered by Supabase).

## 🌟 Features

- **Browse Experiences**: Discover exciting travel experiences with beautiful image galleries
- **Real-time Availability**: View available time slots with live availability updates
- **Smart Booking Flow**: Seamless checkout process with form validation
- **Promo Code System**: Apply discount codes (SAVE10, FLAT100, WELCOME20)
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **Modern UI**: Beautiful animations, shadows, and hover effects

## 🚀 Live Demo

The application is deployed and accessible at: https://c8befdee-d8cf-414a-9d8a-636680bda4e8.lovableproject.com

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **date-fns** for date formatting
- **Lucide React** for icons

### Backend
- **Lovable Cloud** (Supabase-powered backend)
- **PostgreSQL** database
- **Edge Functions** (serverless API endpoints)
- **Row Level Security** (RLS) for data protection

## 📁 Project Structure

```
bookit/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ExperienceCard.tsx
│   │   ├── Hero.tsx
│   │   └── SlotSelector.tsx
│   ├── pages/              # Route pages
│   │   ├── Home.tsx
│   │   ├── ExperienceDetail.tsx
│   │   ├── Checkout.tsx
│   │   ├── Confirmation.tsx
│   │   └── NotFound.tsx
│   ├── integrations/       # Supabase integration
│   └── hooks/              # Custom React hooks
├── supabase/
│   └── functions/          # Edge Functions (API endpoints)
│       ├── experiences/
│       ├── experience-details/
│       ├── bookings/
│       └── validate-promo/
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Tables

**experiences**
- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- price (DECIMAL)
- location (TEXT)
- image_url (TEXT)
- category (TEXT)
- duration (TEXT)
- rating (DECIMAL)
- created_at (TIMESTAMP)

**slots**
- id (UUID, PK)
- experience_id (UUID, FK)
- date (DATE)
- time (TEXT)
- available_spots (INTEGER)
- total_spots (INTEGER)
- created_at (TIMESTAMP)

**bookings**
- id (UUID, PK)
- experience_id (UUID, FK)
- slot_id (UUID, FK)
- user_name (TEXT)
- user_email (TEXT)
- user_phone (TEXT)
- promo_code (TEXT)
- total_price (DECIMAL)
- status (TEXT)
- created_at (TIMESTAMP)

**promo_codes**
- id (UUID, PK)
- code (TEXT, UNIQUE)
- discount_type (TEXT) - 'percentage' or 'fixed'
- discount_value (DECIMAL)
- active (BOOLEAN)
- created_at (TIMESTAMP)

## 🔌 API Endpoints

All endpoints are serverless Edge Functions deployed on Lovable Cloud:

### GET /experiences
Returns list of all experiences
```bash
curl https://skjpqshatowjkcfyhtsy.supabase.co/functions/v1/experiences
```

### GET /experience-details?id={id}
Returns experience details with available slots
```bash
curl https://skjpqshatowjkcfyhtsy.supabase.co/functions/v1/experience-details?id={experience_id}
```

### POST /bookings
Creates a new booking
```bash
curl -X POST https://skjpqshatowjkcfyhtsy.supabase.co/functions/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experience_id": "uuid",
    "slot_id": "uuid",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_phone": "+1234567890",
    "total_price": 89.99
  }'
```

### POST /validate-promo
Validates promo code and returns discount
```bash
curl -X POST https://skjpqshatowjkcfyhtsy.supabase.co/functions/v1/validate-promo \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE10",
    "subtotal": 100.00
  }'
```

## 🔐 Security Features

- **Row Level Security (RLS)**: All database tables have RLS policies enabled
- **Public Access Control**: Experience and slot data is publicly readable
- **Input Validation**: All user inputs are validated before processing
- **Double-booking Prevention**: Atomic operations prevent slot overbooking
- **CORS Protection**: Proper CORS headers on all API endpoints

## 💻 Local Development

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd bookit
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing the Application

### Test Promo Codes
- **SAVE10** - 10% discount
- **FLAT100** - $100 flat discount
- **WELCOME20** - 20% discount

### Sample Data
The database is pre-populated with 6 experiences:
- Sunset Beach Kayaking ($89.99)
- Mountain Hiking Adventure ($129.99)
- Wine Tasting Tour ($149.99)
- Scuba Diving Experience ($199.99)
- Hot Air Balloon Ride ($249.99)
- City Food Tour ($79.99)

Each experience has multiple time slots available for the next 7 days.

## 🎨 Design System

The application uses a custom design system defined in `src/index.css`:
- **Primary Color**: Ocean Blue (#0EA5E9)
- **Secondary Color**: Coral (#FF7849)
- **Typography**: Clean, modern sans-serif
- **Shadows**: Soft, elevated shadows for depth
- **Animations**: Smooth transitions and hover effects

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

The application is automatically deployed on Lovable Cloud. Any changes pushed to the main branch are automatically deployed.

### Manual Deployment
1. Click "Publish" in the Lovable editor
2. The application will be built and deployed automatically
3. Access via the provided URL

## 🔗 Integration Flow

```
User → Frontend (React) → Edge Functions → Database (PostgreSQL) → Response
```

1. User browses experiences on the frontend
2. Frontend makes API calls to Edge Functions
3. Edge Functions query the database
4. Data is returned through the chain
5. UI updates with the response

## 📊 Key Features Implementation

### Slot Availability
- Real-time slot availability checking
- Automatic slot count decrement on booking
- Sold-out state display

### Promo Code Validation
- Server-side validation
- Support for percentage and fixed discounts
- Clear discount application in checkout

### Booking Confirmation
- Immediate confirmation page
- Email details displayed
- Booking ID for reference

## 🤝 Contributing

This is a submission for a fullstack internship assignment. For questions or feedback, please contact the development team.

## 📄 License

This project was created as part of a technical assessment.

## 🙏 Acknowledgments

- Images from Unsplash (royalty-free)
- UI components from shadcn/ui
- Icons from Lucide React
- Backend powered by Lovable Cloud (Supabase)

---

Built with ❤️ using Lovable
=======
# ADVENTURELANE
>>>>>>> 142d2857e2396c8a181e29a4e25d622bd0246876
