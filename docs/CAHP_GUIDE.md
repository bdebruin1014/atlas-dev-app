# CAHP Safe Harbor Tax Abatement Module Guide

## Overview

The CAHP (Carolina Affordable Housing Project) module provides compliance tracking for South Carolina property tax exemptions under S.C. Code § 12-37-220(B)(11)(e) and IRS Revenue Procedure 96-32 Safe Harbor requirements.

## Legal Framework

### South Carolina Statute
**S.C. Code § 12-37-220(B)(11)(e)** - Property Tax Exemption for Nonprofit Housing

**Eligibility Requirements:**
1. Property must be owned by a nonprofit housing corporation OR an instrumentality thereof
2. Property must provide housing to low or very low income residents
3. Must satisfy IRS Revenue Procedure 96-32 Safe Harbor provisions
4. Nonprofit must have "controlling" authority over housing operations

### IRS Revenue Procedure 96-32 Safe Harbor

**Occupancy Requirements:**

**Overall Threshold:**
- At least 75% of units must be occupied by tenants at ≤80% AMI
- Maximum 25% of units can be market rate (>80% AMI)

**Deep Affordability (MUST meet one):**
| Option | Requirement |
|--------|-------------|
| Option A | ≥20% of units at ≤50% AMI (Very Low Income) |
| Option B | ≥40% of units at ≤60% AMI (Low Income) |

*Note: The deep affordability units are included in the 75% qualifying threshold.*

**Over-Income Rule:**
- If tenant income exceeds 140% of applicable limit
- Next available comparable unit must be rented to qualifying tenant

## Entity Structure

### Parent Organization
- **Name:** Carolina Affordable Housing Project, Inc.
- **Type:** SC nonprofit corporation, 501(c)(3)
- **Address:** 333 Wade Hampton Blvd, Greenville, SC 29609

### Operating Subsidiary  
- **Name:** CAHP SC, LLC
- **Role:** Managing Member for qualified properties
- **Ownership:** 100% wholly-owned by parent

## Fee Structure

| Fee Type | Amount | Timing |
|----------|--------|--------|
| Onboarding Fee | $3,500 | One-time at setup |
| Annual Management Fee | 20% of tax savings | See below |

**Fee Payment Schedule:**
- **At SCDOR Approval:** Lump sum reimbursement of fees due from effective date
- **Ongoing:** 20% of annual tax savings invoiced evenly over 12 months

## Module Features

### Dashboard (`/cahp`)
- Portfolio compliance overview
- Tax savings summary
- Critical alerts for non-compliance
- Upcoming recertifications
- Days until DOR certification (October 1)

### Compliance Calculator (`/cahp/calculator`)
- Upload CSV rent roll for analysis
- Manual unit entry
- Real-time AMI percentage calculation
- Threshold compliance checking (75% qualifying, Option A/B)
- Unit-by-unit breakdown
- Rent-to-income ratio warnings
- Recommendations for achieving compliance

### Properties (`/cahp/properties`)
- Property list with compliance status
- Unit counts by income category
- Tax savings per property
- Quick compliance indicators

### Property Detail (`/cahp/properties/:id`)
- Tenant management
- Real-time compliance calculation
- AMI limits reference
- Document storage
- Fee tracking

### Tenant Features
- Income verification tracking
- AMI percentage calculation
- Automatic category assignment
- Recertification scheduling (90 days before anniversary)
- Over-income detection

## Service Layer

### Location
`src/services/cahpService.js`

### Key Functions

**Property Management:**
```javascript
createCAHPProperty({ propertyName, address, county, totalUnits, llcEntity, ... })
getCAHPProperty(propertyId)
getAllCAHPProperties()
updateCAHPProperty(propertyId, updates)
deleteCAHPProperty(propertyId)
```

**Tenant Management:**
```javascript
createTenant({ propertyId, unitNumber, tenantName, householdSize, grossAnnualIncome, ... })
getTenant(tenantId)
getPropertyTenants(propertyId)
updateTenant(tenantId, updates)
deleteTenant(tenantId)
recertifyTenant(tenantId, { grossAnnualIncome, householdSize, documentationNotes })
```

**Compliance:**
```javascript
calculateAMIStatus(grossAnnualIncome, householdSize)
calculatePropertyCompliance(propertyId)
updatePropertyCompliance(propertyId)
getComplianceAlerts()
getTenantRecertificationsDue(daysAhead)
```

**Reporting:**
```javascript
getPortfolioSummary()
getComplianceHistory(propertyId, months)
generateRentRoll(propertyId)
```

### Constants

```javascript
// Income Categories
INCOME_CATEGORIES = {
  VERY_LOW: 'very_low',      // ≤50% AMI
  LOW: 'low',                 // 51-80% AMI
  OVER_INCOME: 'over_income', // >80% AMI, was qualifying
  MARKET_RATE: 'market_rate', // >80% AMI, never qualified
}

// Safe Harbor Thresholds
SAFE_HARBOR_THRESHOLDS = {
  LOW_INCOME_MIN_PCT: 75,      // At least 75% ≤80% AMI
  VERY_LOW_INCOME_MIN_PCT: 20, // At least 20% ≤50% AMI
  OVER_INCOME_TRIGGER: 140,    // 140% of limit triggers over-income
}

// 2024 AMI Limits (Greenville-Anderson MSA)
AMI_LIMITS_2024 = {
  area: 'Greenville-Anderson-Mauldin, SC MSA',
  median_income: 82900,
  limits_by_household_size: {
    1: { very_low: 29050, low: 46450 },
    2: { very_low: 33200, low: 53100 },
    // ... etc
  }
}
```

## Database Schema

### Location
`docs/cahp-schema.sql`

### Tables

| Table | Purpose |
|-------|---------|
| `cahp_properties` | Property records with tax info |
| `cahp_tenants` | Tenant income & lease data |
| `cahp_tenant_certifications` | Certification history |
| `cahp_compliance_snapshots` | Point-in-time compliance |
| `cahp_certifications` | Annual DOR certifications |
| `cahp_ami_limits` | HUD income limits by year |
| `cahp_alerts` | System-generated alerts |
| `cahp_fees` | Fee tracking & invoicing |

### Helper Functions

```sql
-- Calculate AMI percentage
calculate_ami_percentage(income, household_size, year)

-- Determine income category
determine_income_category(income, household_size, year)

-- Get property compliance summary
get_property_compliance(property_id)
```

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/cahp` | CAHPDashboardPage | Portfolio dashboard |
| `/cahp/properties` | CAHPPropertiesPage | Properties list |
| `/cahp/properties/:id` | CAHPPropertyDetailPage | Property detail with tenants |

## Components

### Location
`src/components/cahp/`

| Component | Purpose |
|-----------|---------|
| `AddTenantModal` | Add new tenant with income verification |
| `RecertifyTenantModal` | Annual income recertification |

## Navigation

Property Mgmt dropdown → Compliance section → "CAHP Safe Harbor"

## Compliance Calendar

### Monthly Tasks
- Review rent roll for income compliance
- Track move-ins/move-outs
- Update occupancy percentages

### Quarterly Tasks  
- Calculate 75%/20% compliance ratios
- Prepare occupancy report
- Review over-income situations
- Document cure actions

### Annual Tasks

| Date | Task |
|------|------|
| January | Review new HUD AMI limits |
| March | Update maximum rent calculations |
| July | Begin annual recertification process |
| September | Prepare DOR certification documentation |
| **October 1** | **SUBMIT ANNUAL CERTIFICATION TO SC DOR** |
| December | Year-end compliance review |

## Documentation Requirements

### Per Property
- Executed Operating Agreement (with Safe Harbor provisions)
- Articles of Organization
- IRS 501(c)(3) Determination Letter
- Initial DOR exemption application
- Annual DOR certifications (retain 6+ years)
- Property tax assessments
- Rent rolls

### Per Tenant
- Lease agreement
- Initial income certification
- Supporting income documentation
- Annual recertifications
- Over-income documentation (if applicable)

## Alerts

### Critical (Immediate Action)
- Occupancy below 75% low-income threshold
- Occupancy below 20% very low-income threshold
- Over-income tenant identified (>140%)

### Warning (7-day advance)
- Tenant recertification due
- Annual DOR certification due
- Lease expiration approaching

### Informational
- New HUD AMI limits released
- Property tax assessment received
- Certification approved by DOR

## Future Enhancements

1. **DOR Form Generation** - Auto-populate certification forms
2. **Income Document Upload** - Attach verification docs to tenants
3. **AMI Auto-Update** - Fetch new HUD limits annually
4. **Compliance Reports** - PDF export for auditors
5. **Tenant Portal** - Self-service recertification
6. **Email Notifications** - Automated reminders
7. **Multi-Property Certification** - Batch DOR submissions

## External Resources

- [S.C. Code § 12-37-220](https://www.scstatehouse.gov/code/t12c037.php)
- [IRS Revenue Procedure 96-32](https://www.irs.gov/pub/irs-tege/rp_1996-32.pdf)
- [HUD Income Limits](https://www.huduser.gov/portal/datasets/il.html)
- [SC DOR Property Tax Forms](https://dor.sc.gov/forms)

---

*Module Version: 1.0*
*Maintained by: VanRock Holdings LLC / Carolina Affordable Housing Project, Inc.*
