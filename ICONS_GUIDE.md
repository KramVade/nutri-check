# Icon Usage Guide for Nutri-Check

## Installed Libraries

### 1. Heroicons (Primary)
- **Package**: `@heroicons/vue`
- **Version**: 2.2.0
- **Style**: Clean, modern, minimal
- **Best for**: UI elements, navigation, features

### 2. Font Awesome (Secondary)
- **Package**: `@fortawesome/vue-fontawesome`
- **Version**: 3.1.2
- **Style**: Comprehensive icon set
- **Best for**: Specific health/medical icons

## Usage Examples

### Heroicons (Recommended for most cases)

```vue
<script setup>
import { HeartIcon, UserIcon, ChartBarIcon } from '@heroicons/vue/24/solid'
// or for outline style:
import { HeartIcon, UserIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <HeartIcon class="w-6 h-6 text-green-500" />
  <UserIcon class="icon-class" />
</template>

<style scoped>
.icon-class {
  width: 1.5rem;
  height: 1.5rem;
  color: #42b983;
}
</style>
```

### Font Awesome

```vue
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeartbeat, faWeight, faRuler } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <font-awesome-icon :icon="faHeartbeat" class="text-green-500" />
  <font-awesome-icon :icon="faWeight" size="2x" />
</template>
```

## Icons Used in Landing Page

### Navigation
- **Logo**: `HeartIcon` (solid) - Represents health/wellness
- **Login Button**: `ArrowRightOnRectangleIcon` (solid)

### Hero Section Cards
- **Healthy Card**: `HeartIcon` (solid) - Health status
- **Track Card**: `ChartBarIcon` (solid) - Analytics/tracking
- **Goals Card**: `CheckBadgeIcon` (solid) - Achievement/goals

### Features Section
- **Fast BMI**: `BoltIcon` (solid) - Speed/instant
- **Personalized**: `LightBulbIcon` (solid) - Ideas/suggestions
- **Arduino**: `CpuChipIcon` (solid) - Technology/integration

### CTA Button
- **Arrow**: `ArrowRightIcon` (solid) - Forward action

## Recommended Icons for Other Pages

### Patient Management
- `UserIcon` - Patient profile
- `UsersIcon` - Patient list
- `UserPlusIcon` - Add patient
- `IdentificationIcon` - Patient ID

### Health/BMI
- `ScaleIcon` - Weight
- `ArrowTrendingUpIcon` - BMI trending up
- `ArrowTrendingDownIcon` - BMI trending down
- `HeartIcon` - Health status
- `ChartBarIcon` - Statistics

### Actions
- `PencilIcon` - Edit
- `TrashIcon` - Delete
- `EyeIcon` - View
- `ArrowLeftIcon` - Back
- `HomeIcon` - Home
- `ArrowRightOnRectangleIcon` - Login/Logout

### Forms
- `EnvelopeIcon` - Email
- `LockClosedIcon` - Password
- `PhoneIcon` - Contact
- `CalendarIcon` - Date

### Status
- `CheckCircleIcon` - Success
- `XCircleIcon` - Error
- `ExclamationTriangleIcon` - Warning
- `InformationCircleIcon` - Info

## Styling Tips

### Size Classes
```css
.icon-sm { width: 1rem; height: 1rem; }
.icon-md { width: 1.5rem; height: 1.5rem; }
.icon-lg { width: 2rem; height: 2rem; }
.icon-xl { width: 3rem; height: 3rem; }
```

### Color Scheme
```css
.icon-primary { color: #42b983; }
.icon-success { color: #10b981; }
.icon-danger { color: #e74c3c; }
.icon-warning { color: #f59e0b; }
.icon-info { color: #3b82f6; }
```

### With Background
```css
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.icon-wrapper .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}
```

## Resources

- **Heroicons**: https://heroicons.com/
- **Font Awesome**: https://fontawesome.com/icons
- **Heroicons Vue Docs**: https://github.com/tailwindlabs/heroicons#vue
- **Font Awesome Vue Docs**: https://fontawesome.com/docs/web/use-with/vue/
