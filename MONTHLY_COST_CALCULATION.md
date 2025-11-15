# Monthly Cost Calculation - QuickBite QR
## Using Supabase Team Plan + Vercel Pro Plan

### ✅ **Services Included**

#### 1. **Supabase Team Plan** - **$599/month**
**What you get:**
- ✅ 50 GB database storage
- ✅ 250 GB bandwidth/month
- ✅ 500,000 MAU (Monthly Active Users)
- ✅ 50 GB file storage (for menu images, QR codes)
- ✅ 200 GB file bandwidth/month
- ✅ Daily backups
- ✅ Point-in-time recovery
- ✅ Priority support

**Covers:**
- Database (orders, menu items, users)
- Authentication (user login/signup)
- File storage (menu images, QR codes)
- Real-time subscriptions (live orders)
- API endpoints

---

#### 2. **Vercel Pro Plan** - **$20/month**
**What you get:**
- ✅ Unlimited bandwidth
- ✅ 100 GB bandwidth (usually enough)
- ✅ Serverless functions (API routes)
- ✅ Automatic SSL certificates
- ✅ Global CDN included
- ✅ Preview deployments
- ✅ Analytics (basic)

**Covers:**
- Next.js app hosting
- API routes (serverless functions)
- Static asset serving
- Global CDN

---

### 📊 **Additional Essential Services**

#### 3. **Email Service (Resend Pro)** - **$20/month**
**What you get:**
- ✅ 50,000 emails/month
- ✅ Transactional emails
- ✅ Order confirmations
- ✅ Password resets
- ✅ Notifications

**Why needed:**
- Order confirmations to customers
- Password reset emails
- Notifications to restaurants

---

#### 4. **Domain** - **~$1/month** ($12/year)
**What you get:**
- ✅ Custom domain (e.g., quickbiteqr.com)
- ✅ SSL certificate (included with Vercel)

---

#### 5. **Monitoring (Sentry Pro)** - **$26/month** (Optional but recommended)
**What you get:**
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ 50,000 errors/month
- ✅ Real-time alerts

**Why recommended:**
- Catch errors before customers report them
- Monitor performance issues
- Track API errors

---

## 💰 **Total Monthly Cost Breakdown**

### **Essential Services (Required):**
| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Supabase Team Plan | $599 | Database, Auth, Storage |
| Vercel Pro Plan | $20 | Hosting, CDN |
| Resend Pro (Email) | $20 | Transactional emails |
| Domain | $1 | Custom domain |
| **TOTAL** | **$640/month** | |

### **With Monitoring (Recommended):**
| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Supabase Team Plan | $599 | Database, Auth, Storage |
| Vercel Pro Plan | $20 | Hosting, CDN |
| Resend Pro (Email) | $20 | Transactional emails |
| Domain | $1 | Custom domain |
| Sentry Pro (Monitoring) | $26 | Error tracking |
| **TOTAL** | **$666/month** | |

---

## 📊 **Detailed Cost Justification**

### **Supabase Team Plan ($599/month) - Required**

**Why you need it:**
- **MAU Limit**: 1.5M customers/month (Pro plan only allows 100K)
- **Bandwidth**: ~100-200 GB/month (Pro plan only allows 50GB)
- **Storage**: ~10-15 GB database (Pro plan only allows 8GB)
- **File Storage**: Menu images, QR codes (Pro plan only allows 5GB)

**What it includes:**
- Database hosting
- Authentication system
- File storage (no need for UploadThing!)
- Real-time subscriptions
- API endpoints

**Cost per restaurant**: $599 ÷ 500 = **$1.20/restaurant/month**

---

### **Vercel Pro Plan ($20/month) - Required**

**Why you need it:**
- Hosts your Next.js application
- Global CDN for fast loading
- Serverless functions for API routes
- Automatic SSL certificates
- Preview deployments for testing

**What it includes:**
- Unlimited bandwidth (usually enough)
- 100 GB bandwidth (usually sufficient)
- Global CDN (free)
- Automatic deployments

**Cost per restaurant**: $20 ÷ 500 = **$0.04/restaurant/month**

---

### **Resend Pro ($20/month) - Required**

**Why you need it:**
- Order confirmations to customers
- Password reset emails
- Notifications to restaurants
- Transactional emails

**Usage estimate:**
- ~1.5M orders/month × 1 email = ~1.5M emails
- But you'll likely send fewer (not all orders need emails)
- 50,000 emails/month should cover most use cases

**Alternative**: Use Supabase Edge Functions with email service (free tier might work)

---

### **Domain ($1/month) - Required**

**Why you need it:**
- Professional branding
- Custom domain (e.g., quickbiteqr.com)
- SSL certificate (free with Vercel)

**Cost**: ~$12/year = **$1/month**

---

### **Sentry Pro ($26/month) - Optional but Recommended**

**Why it's recommended:**
- Catch errors before customers report them
- Monitor API performance
- Track database errors
- Real-time alerts

**Can skip if:**
- Budget is tight
- You can monitor errors manually
- You have other error tracking

**Alternative**: Use Vercel Analytics (free, basic) or skip entirely

---

## 💡 **Cost Optimization Options**

### **Option 1: Skip Monitoring (Save $26/month)**
**Total**: **$640/month**
- Remove Sentry Pro
- Use Vercel Analytics (free) instead
- Monitor errors manually

### **Option 2: Use Free Email Tier (Save $20/month)**
**Total**: **$620/month**
- Use Resend Free tier (3,000 emails/month)
- Or use Supabase Edge Functions with email service
- Only send critical emails

**Note**: This might not be enough for 500 restaurants!

### **Option 3: Both Optimizations (Save $46/month)**
**Total**: **$594/month**
- Remove Sentry Pro
- Use free email tier (if sufficient)

---

## 🎯 **Recommended Setup**

### **Minimum Required (Essential):**
```
✅ Supabase Team Plan: $599/month
✅ Vercel Pro Plan: $20/month
✅ Resend Pro: $20/month
✅ Domain: $1/month
─────────────────────────────
Total: $640/month
```

### **With Monitoring (Recommended):**
```
✅ Supabase Team Plan: $599/month
✅ Vercel Pro Plan: $20/month
✅ Resend Pro: $20/month
✅ Domain: $1/month
✅ Sentry Pro: $26/month
─────────────────────────────
Total: $666/month
```

---

## 📈 **Cost Per Restaurant**

### **With 500 Restaurants:**
- **Essential Setup**: $640 ÷ 500 = **$1.28/restaurant/month**
- **With Monitoring**: $666 ÷ 500 = **$1.33/restaurant/month**

### **With 100 Restaurants:**
- **Essential Setup**: $640 ÷ 100 = **$6.40/restaurant/month**
- **With Monitoring**: $666 ÷ 100 = **$6.66/restaurant/month**

### **With 50 Restaurants:**
- **Essential Setup**: $640 ÷ 50 = **$12.80/restaurant/month**
- **With Monitoring**: $666 ÷ 50 = **$13.32/restaurant/month**

**💡 Insight**: More restaurants = lower cost per restaurant!

---

## 💰 **Revenue Model to Cover Costs**

### **Pricing Suggestions:**

#### **Option 1: ₹999/month per restaurant**
- 500 restaurants × ₹999 = ₹499,500/month (~$6,000/month)
- **Cost**: $640/month
- **Profit**: $5,360/month (89% profit margin) ✅

#### **Option 2: ₹1,499/month per restaurant**
- 500 restaurants × ₹1,499 = ₹749,500/month (~$9,000/month)
- **Cost**: $640/month
- **Profit**: $8,360/month (93% profit margin) ✅

#### **Option 3: ₹1,999/month per restaurant**
- 500 restaurants × ₹1,999 = ₹999,500/month (~$12,000/month)
- **Cost**: $640/month
- **Profit**: $11,360/month (95% profit margin) ✅

### **Break-Even Analysis:**
- **Monthly Cost**: $640
- **Break-even**: 1 restaurant at ₹999/month (~$12/month)
- **At 500 restaurants**: Very profitable! 💰

---

## ⚠️ **Important Notes**

### **1. No UploadThing Needed!**
- Supabase Team plan includes 50 GB file storage
- Can store menu images, QR codes directly
- **Save**: $25/month (no UploadThing needed)

### **2. Vercel Pro vs Enterprise**
- Pro plan ($20/month) should be enough
- Enterprise plan ($500+/month) only if you need:
  - More than 100 GB bandwidth
  - Custom domains
  - Advanced features

### **3. Supabase Storage vs UploadThing**
- Supabase Team plan: 50 GB file storage (included)
- UploadThing Pro+: 10 GB file storage ($25/month)
- **Winner**: Supabase (more storage, included in price)

### **4. Email Service Alternatives**
- **Resend Pro**: $20/month (50K emails) - Recommended
- **SendGrid**: $15/month (40K emails) - Cheaper
- **AWS SES**: $0.10 per 1,000 emails (~$150/month for 1.5M emails) - Expensive

---

## 📊 **Summary**

### **Minimum Monthly Cost: $640/month**
- ✅ Supabase Team Plan: $599/month
- ✅ Vercel Pro Plan: $20/month
- ✅ Resend Pro: $20/month
- ✅ Domain: $1/month

### **Recommended Monthly Cost: $666/month**
- ✅ Everything above
- ✅ Sentry Pro: $26/month (monitoring)

### **Cost Per Restaurant:**
- **500 restaurants**: $1.28-1.33/restaurant/month
- **Very affordable!** 💰

### **Revenue to Cover Costs:**
- **Break-even**: 1 restaurant at ₹999/month
- **At 500 restaurants**: 89-95% profit margin
- **Very profitable!** 🎯

