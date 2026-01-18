export type VendorType =
  | 'venue'
  | 'planner'
  | 'photographer'
  | 'videographer'
  | 'caterer'
  | 'florist'
  | 'dj'
  | 'band'
  | 'cake'
  | 'hair_makeup'
  | 'officiant'
  | 'transportation'
  | 'rentals'
  | 'stationery'
  | 'other'

export interface VendorQuestion {
  id: string
  question: string
  tip?: string
}

export const vendorTypeLabels: Record<VendorType, string> = {
  venue: 'Venue',
  planner: 'Wedding Planner',
  photographer: 'Photographer',
  videographer: 'Videographer',
  caterer: 'Caterer',
  florist: 'Florist',
  dj: 'DJ',
  band: 'Band',
  cake: 'Cake/Bakery',
  hair_makeup: 'Hair & Makeup',
  officiant: 'Officiant',
  transportation: 'Transportation',
  rentals: 'Rentals',
  stationery: 'Stationery',
  other: 'Other',
}

export const universalQuestions: VendorQuestion[] = [
  { id: 'u1', question: "What's your cancellation/refund policy?" },
  { id: 'u2', question: 'Do you carry liability insurance?' },
  { id: 'u3', question: "What's the deposit and payment schedule?" },
  { id: 'u4', question: 'How will you use photos/video from our wedding?' },
  { id: 'u5', question: 'Who is our point of contact?' },
  { id: 'u6', question: "What's in the contract?" },
]

export const vendorQuestions: Record<VendorType, VendorQuestion[]> = {
  venue: [
    { id: 'v1', question: 'Is our date available? What\'s the rental fee?' },
    { id: 'v2', question: 'What\'s the guest capacity (ceremony vs reception)?' },
    { id: 'v3', question: 'What\'s included (tables, chairs, linens, catering)?' },
    { id: 'v4', question: 'Are outside vendors allowed? Any required vendors?' },
    { id: 'v5', question: 'What\'s the rain/weather backup plan?' },
    { id: 'v6', question: 'How many restrooms?', tip: 'Need 4+ per 100 guests' },
    { id: 'v7', question: 'What time can vendors arrive for setup?' },
    { id: 'v8', question: 'Is there parking? Overnight accommodations?' },
    { id: 'v9', question: 'Can we do a rehearsal here? Is there a fee?' },
    { id: 'v10', question: 'Are there other weddings the same day?' },
  ],
  planner: [
    { id: 'p1', question: 'Are you available on our date?' },
    { id: 'p2', question: 'How many weddings do you book per month?' },
    { id: 'p3', question: 'What\'s included in your packages (full planning vs day-of)?' },
    { id: 'p4', question: 'Will you be on-site the wedding day, or an assistant?' },
    { id: 'p5', question: 'How do you handle vendor recommendations? Take commissions?' },
    { id: 'p6', question: 'What\'s your communication style (weekly calls, email, text)?' },
    { id: 'p7', question: 'What\'s your backup plan if you\'re sick?' },
    { id: 'p8', question: 'Can we see a recent wedding timeline you created?' },
  ],
  photographer: [
    { id: 'ph1', question: 'Can we see a full wedding gallery (not just highlights)?' },
    { id: 'ph2', question: 'Have you shot at our venue before?' },
    { id: 'ph3', question: 'What\'s your style (documentary, editorial, traditional)?' },
    { id: 'ph4', question: 'How many hours included? Cost of extra hours?' },
    { id: 'ph5', question: 'Do you bring backup equipment?' },
    { id: 'ph6', question: 'When do we receive photos? How many edited images?' },
    { id: 'ph7', question: 'Do you offer engagement sessions?' },
    { id: 'ph8', question: 'Who owns the rights to the photos?' },
  ],
  videographer: [
    { id: 'vd1', question: 'Can we see full wedding videos (not just trailers)?' },
    { id: 'vd2', question: 'Have you filmed at our venue before?' },
    { id: 'vd3', question: 'What\'s your filming style (cinematic, documentary)?' },
    { id: 'vd4', question: 'How many videographers will be there?' },
    { id: 'vd5', question: 'Do you bring backup equipment?' },
    { id: 'vd6', question: 'What\'s the turnaround time for edits?' },
    { id: 'vd7', question: 'What formats do we receive (highlight, full ceremony, raw)?' },
    { id: 'vd8', question: 'Do you coordinate with the photographer?' },
  ],
  caterer: [
    { id: 'c1', question: 'Have you worked at our venue before?' },
    { id: 'c2', question: 'Can we do a tasting before booking?' },
    { id: 'c3', question: 'Can you accommodate dietary restrictions (vegan, allergies, halal, kosher)?' },
    { id: 'c4', question: 'Is the food fresh, frozen, or locally sourced?' },
    { id: 'c5', question: 'What\'s included (plates, glasses, linens, servers)?' },
    { id: 'c6', question: 'Do you handle bar service? Corkage fees?' },
    { id: 'c7', question: 'How do you handle leftovers?' },
    { id: 'c8', question: 'What\'s the cost per person?' },
  ],
  florist: [
    { id: 'f1', question: 'What style do you specialize in?' },
    { id: 'f2', question: 'Can you work within our budget of $___?' },
    { id: 'f3', question: 'Will you visit the venue beforehand?' },
    { id: 'f4', question: 'What\'s included (bouquets, boutonnieres, centerpieces, ceremony decor)?' },
    { id: 'f5', question: 'Are flowers in-season for our date?' },
    { id: 'f6', question: 'Will you be on-site to distribute personal flowers?' },
    { id: 'f7', question: 'Can we see samples before the wedding?' },
    { id: 'f8', question: 'Do you handle setup and breakdown?' },
  ],
  dj: [
    { id: 'dj1', question: 'Have you worked at our venue before?' },
    { id: 'dj2', question: 'How much setup time do you need?' },
    { id: 'dj3', question: 'Can we provide a must-play and do-not-play list?' },
    { id: 'dj4', question: 'Do you MC and make announcements?' },
    { id: 'dj5', question: 'What will you wear?' },
    { id: 'dj6', question: 'Do you provide lighting?' },
    { id: 'dj7', question: 'What\'s your backup plan for equipment failure?' },
    { id: 'dj8', question: 'Can we hear you at a live event or see videos?' },
  ],
  band: [
    { id: 'b1', question: 'Have you played at our venue before?' },
    { id: 'b2', question: 'How much setup time and space do you need?' },
    { id: 'b3', question: 'Can we provide song requests?' },
    { id: 'b4', question: 'Do you MC and make announcements?' },
    { id: 'b5', question: 'What will you wear?' },
    { id: 'b6', question: 'How many breaks do you take? What happens during breaks?' },
    { id: 'b7', question: 'Can we see you perform live before booking?' },
    { id: 'b8', question: 'What happens if a band member gets sick?' },
  ],
  cake: [
    { id: 'ck1', question: 'Can we do a tasting?' },
    { id: 'ck2', question: 'What flavors and fillings do you offer?' },
    { id: 'ck3', question: 'Can you match our design inspiration?' },
    { id: 'ck4', question: 'How is pricing determined (per slice, per tier)?' },
    { id: 'ck5', question: 'Do you deliver and set up?' },
    { id: 'ck6', question: 'How far in advance is the cake made?' },
    { id: 'ck7', question: 'Do you provide a cake stand and serving set?' },
  ],
  hair_makeup: [
    { id: 'hm1', question: 'Can we do a trial?' },
    { id: 'hm2', question: 'How many people can you accommodate?' },
    { id: 'hm3', question: 'Will you travel to our venue?' },
    { id: 'hm4', question: 'What products do you use? Any specific brands?' },
    { id: 'hm5', question: 'How long does each person take?' },
    { id: 'hm6', question: 'Do you stay for touch-ups?' },
    { id: 'hm7', question: 'What\'s your backup plan if you\'re sick?' },
  ],
  officiant: [
    { id: 'o1', question: 'Are you licensed to marry us in our state?' },
    { id: 'o2', question: 'Have you officiated at our venue before?' },
    { id: 'o3', question: 'Can we write our own vows?' },
    { id: 'o4', question: 'Can we see a sample ceremony script?' },
    { id: 'o5', question: 'What do you wear?' },
    { id: 'o6', question: 'Do you handle the marriage license paperwork?' },
    { id: 'o7', question: 'Will you attend the rehearsal?' },
  ],
  transportation: [
    { id: 't1', question: 'What vehicles do you have available?' },
    { id: 't2', question: 'How is pricing structured (hourly, flat rate)?' },
    { id: 't3', question: 'Is gratuity included?' },
    { id: 't4', question: 'What\'s the cancellation policy for weather?' },
    { id: 't5', question: 'Can we see the vehicle before booking?' },
    { id: 't6', question: 'What happens if the vehicle breaks down?' },
  ],
  rentals: [
    { id: 'r1', question: 'What\'s your inventory for our date?' },
    { id: 'r2', question: 'Do you deliver and pick up? What are the fees?' },
    { id: 'r3', question: 'What\'s the damage policy?' },
    { id: 'r4', question: 'Can we see items in person?' },
    { id: 'r5', question: 'What condition should items be returned in?' },
    { id: 'r6', question: 'What\'s the deadline to finalize quantities?' },
  ],
  stationery: [
    { id: 's1', question: 'Can we see samples of your work?' },
    { id: 's2', question: 'What\'s the turnaround time?' },
    { id: 's3', question: 'Do you offer addressing and mailing services?' },
    { id: 's4', question: 'What paper and printing options do you offer?' },
    { id: 's5', question: 'How many rounds of revisions are included?' },
    { id: 's6', question: 'Can you match items to our wedding website?' },
  ],
  other: [],
}

export function getQuestionsForVendorType(type: VendorType): VendorQuestion[] {
  return [...vendorQuestions[type], ...universalQuestions]
}
