export interface ChecklistItem {
  id: string
  title: string
  description?: string
  category: string
  timeframe: string
  sortOrder: number
}

export interface ChecklistCategory {
  id: string
  name: string
  timeframe: string
  description: string
  items: ChecklistItem[]
}

export const defaultChecklist: ChecklistCategory[] = [
  {
    id: '18-months',
    name: '18+ Months Out',
    timeframe: '18+ months',
    description: 'Where you are now! Time to celebrate and start planning.',
    items: [
      { id: '1', title: 'Celebrate engagement', category: '18-months', timeframe: '18+ months', sortOrder: 1 },
      { id: '2', title: 'Have the budget conversation - determine total and who\'s contributing', category: '18-months', timeframe: '18+ months', sortOrder: 2 },
      { id: '3', title: 'Create dedicated wedding email', category: '18-months', timeframe: '18+ months', sortOrder: 3 },
      { id: '4', title: 'Create shared Google Drive/folder for contracts and inspiration', category: '18-months', timeframe: '18+ months', sortOrder: 4 },
      { id: '5', title: 'Build initial guest list to determine wedding size', category: '18-months', timeframe: '18+ months', sortOrder: 5 },
      { id: '6', title: 'Research and tour venues', category: '18-months', timeframe: '18+ months', sortOrder: 6 },
      { id: '7', title: 'Gather vendor inspiration', category: '18-months', timeframe: '18+ months', sortOrder: 7 },
    ],
  },
  {
    id: '12-14-months',
    name: '12-14 Months Out',
    timeframe: '12-14 months',
    description: 'Time to book major vendors and lock in the big decisions.',
    items: [
      { id: '8', title: 'Book venue and lock in date', category: '12-14-months', timeframe: '12-14 months', sortOrder: 1 },
      { id: '9', title: 'Hire wedding planner/coordinator (if desired)', category: '12-14-months', timeframe: '12-14 months', sortOrder: 2 },
      { id: '10', title: 'Set up wedding website', category: '12-14-months', timeframe: '12-14 months', sortOrder: 3 },
      { id: '11', title: 'Research and book photographer/videographer', category: '12-14-months', timeframe: '12-14 months', sortOrder: 4 },
      { id: '12', title: 'Choose wedding party', category: '12-14-months', timeframe: '12-14 months', sortOrder: 5 },
      { id: '13', title: 'Start dress/attire shopping (custom gowns need 6-9 months!)', category: '12-14-months', timeframe: '12-14 months', sortOrder: 6 },
      { id: '14', title: 'Take engagement photos', category: '12-14-months', timeframe: '12-14 months', sortOrder: 7 },
      { id: '15', title: 'Choose officiant', category: '12-14-months', timeframe: '12-14 months', sortOrder: 8 },
      { id: '16', title: 'Consider pre-marital counseling', category: '12-14-months', timeframe: '12-14 months', sortOrder: 9 },
    ],
  },
  {
    id: '10-11-months',
    name: '10-11 Months Out',
    timeframe: '10-11 months',
    description: 'Book more vendors and start planning the fun details.',
    items: [
      { id: '17', title: 'Book caterer and schedule tastings', category: '10-11-months', timeframe: '10-11 months', sortOrder: 1 },
      { id: '18', title: 'Book florist', category: '10-11-months', timeframe: '10-11 months', sortOrder: 2 },
      { id: '19', title: 'Start honeymoon research', category: '10-11-months', timeframe: '10-11 months', sortOrder: 3 },
      { id: '20', title: 'Book DJ/band', category: '10-11-months', timeframe: '10-11 months', sortOrder: 4 },
      { id: '21', title: 'Arrange hotel room blocks for guests', category: '10-11-months', timeframe: '10-11 months', sortOrder: 5 },
      { id: '22', title: 'Plan bachelor/bachelorette parties', category: '10-11-months', timeframe: '10-11 months', sortOrder: 6 },
    ],
  },
  {
    id: '8-9-months',
    name: '8-9 Months Out',
    timeframe: '8-9 months',
    description: 'Send save-the-dates and finalize vendor bookings.',
    items: [
      { id: '23', title: 'Send save-the-dates', category: '8-9-months', timeframe: '8-9 months', sortOrder: 1 },
      { id: '24', title: 'Book additional vendors (videographer, photobooth, etc.)', category: '8-9-months', timeframe: '8-9 months', sortOrder: 2 },
      { id: '25', title: 'Decide on wedding party attire', category: '8-9-months', timeframe: '8-9 months', sortOrder: 3 },
      { id: '26', title: 'Research required permits (if outdoor/unique venue)', category: '8-9-months', timeframe: '8-9 months', sortOrder: 4 },
      { id: '27', title: 'Create wedding party group chat', category: '8-9-months', timeframe: '8-9 months', sortOrder: 5 },
      { id: '28', title: 'Book honeymoon flights/hotels', category: '8-9-months', timeframe: '8-9 months', sortOrder: 6 },
    ],
  },
  {
    id: '6-7-months',
    name: '6-7 Months Out',
    timeframe: '6-7 months',
    description: 'Venue walkthroughs, invitations, and registry.',
    items: [
      { id: '29', title: 'Do venue walkthrough with key vendors', category: '6-7-months', timeframe: '6-7 months', sortOrder: 1 },
      { id: '30', title: 'Plan rehearsal dinner', category: '6-7-months', timeframe: '6-7 months', sortOrder: 2 },
      { id: '31', title: 'Research marriage license requirements for your state', category: '6-7-months', timeframe: '6-7 months', sortOrder: 3 },
      { id: '32', title: 'Order invitations', category: '6-7-months', timeframe: '6-7 months', sortOrder: 4 },
      { id: '33', title: 'Schedule cake tastings', category: '6-7-months', timeframe: '6-7 months', sortOrder: 5 },
      { id: '34', title: 'Finalize registry', category: '6-7-months', timeframe: '6-7 months', sortOrder: 6 },
      { id: '35', title: 'Plan any DIY projects', category: '6-7-months', timeframe: '6-7 months', sortOrder: 7 },
      { id: '36', title: 'Create weather backup plan (if outdoor)', category: '6-7-months', timeframe: '6-7 months', sortOrder: 8 },
    ],
  },
  {
    id: '4-5-months',
    name: '4-5 Months Out',
    timeframe: '4-5 months',
    description: 'Fittings, rings, and confirming all the details.',
    items: [
      { id: '37', title: 'Book hair and makeup artist', category: '4-5-months', timeframe: '4-5 months', sortOrder: 1 },
      { id: '38', title: 'First dress fitting', category: '4-5-months', timeframe: '4-5 months', sortOrder: 2 },
      { id: '39', title: 'Order wedding rings', category: '4-5-months', timeframe: '4-5 months', sortOrder: 3 },
      { id: '40', title: 'Book rehearsal dinner venue', category: '4-5-months', timeframe: '4-5 months', sortOrder: 4 },
      { id: '41', title: 'Arrange wedding day transportation', category: '4-5-months', timeframe: '4-5 months', sortOrder: 5 },
      { id: '42', title: 'Purchase wedding party/parent gifts', category: '4-5-months', timeframe: '4-5 months', sortOrder: 6 },
      { id: '43', title: 'Create shot list for photographer', category: '4-5-months', timeframe: '4-5 months', sortOrder: 7 },
      { id: '44', title: 'Confirm all vendor contracts', category: '4-5-months', timeframe: '4-5 months', sortOrder: 8 },
    ],
  },
  {
    id: '2-3-months',
    name: '2-3 Months Out',
    timeframe: '2-3 months',
    description: 'Mail invitations and finalize ceremony details.',
    items: [
      { id: '45', title: 'Mail wedding invitations', category: '2-3-months', timeframe: '2-3 months', sortOrder: 1 },
      { id: '46', title: 'Start writing vows', category: '2-3-months', timeframe: '2-3 months', sortOrder: 2 },
      { id: '47', title: 'Create day-of timeline', category: '2-3-months', timeframe: '2-3 months', sortOrder: 3 },
      { id: '48', title: 'Finalize ceremony details (readings, music)', category: '2-3-months', timeframe: '2-3 months', sortOrder: 4 },
      { id: '49', title: 'Order welcome bags for out-of-town guests', category: '2-3-months', timeframe: '2-3 months', sortOrder: 5 },
      { id: '50', title: 'Confirm honeymoon bookings and travel documents', category: '2-3-months', timeframe: '2-3 months', sortOrder: 6 },
      { id: '51', title: 'Second dress fitting/alterations', category: '2-3-months', timeframe: '2-3 months', sortOrder: 7 },
      { id: '52', title: 'Track RSVPs aggressively', category: '2-3-months', timeframe: '2-3 months', sortOrder: 8 },
    ],
  },
  {
    id: '1-month',
    name: '1 Month Out',
    timeframe: '1 month',
    description: 'Final details and preparation.',
    items: [
      { id: '53', title: 'Finalize seating chart', category: '1-month', timeframe: '1 month', sortOrder: 1 },
      { id: '54', title: 'Obtain marriage license', category: '1-month', timeframe: '1 month', sortOrder: 2 },
      { id: '55', title: 'Print programs, menus, place cards', category: '1-month', timeframe: '1 month', sortOrder: 3 },
      { id: '56', title: 'Final dress fitting', category: '1-month', timeframe: '1 month', sortOrder: 4 },
      { id: '57', title: 'Confirm all vendor arrival times', category: '1-month', timeframe: '1 month', sortOrder: 5 },
      { id: '58', title: 'Create processional/recessional order', category: '1-month', timeframe: '1 month', sortOrder: 6 },
      { id: '59', title: 'Break in wedding shoes', category: '1-month', timeframe: '1 month', sortOrder: 7 },
      { id: '60', title: 'Prepare vendor payments and tip envelopes', category: '1-month', timeframe: '1 month', sortOrder: 8 },
    ],
  },
  {
    id: '1-week',
    name: '1 Week Before',
    timeframe: '1 week',
    description: 'Final confirmations and packing.',
    items: [
      { id: '61', title: 'Confirm final headcount with caterer', category: '1-week', timeframe: '1 week', sortOrder: 1 },
      { id: '62', title: 'Pack for honeymoon', category: '1-week', timeframe: '1 week', sortOrder: 2 },
      { id: '63', title: 'Prepare emergency kit (safety pins, stain remover, band-aids, etc.)', category: '1-week', timeframe: '1 week', sortOrder: 3 },
      { id: '64', title: 'Gather all ceremony items in one box', category: '1-week', timeframe: '1 week', sortOrder: 4 },
      { id: '65', title: 'Brief wedding party on schedule', category: '1-week', timeframe: '1 week', sortOrder: 5 },
      { id: '66', title: 'Assign day-of point person for vendor questions', category: '1-week', timeframe: '1 week', sortOrder: 6 },
      { id: '67', title: 'REST and hydrate!', category: '1-week', timeframe: '1 week', sortOrder: 7 },
    ],
  },
  {
    id: 'day-before',
    name: 'Day Before',
    timeframe: 'day before',
    description: 'Rehearsal and final preparations.',
    items: [
      { id: '68', title: 'Wedding rehearsal', category: 'day-before', timeframe: 'day before', sortOrder: 1 },
      { id: '69', title: 'Confirm vendor delivery times', category: 'day-before', timeframe: 'day before', sortOrder: 2 },
      { id: '70', title: 'Prepare marriage license and vows in designated spot', category: 'day-before', timeframe: 'day before', sortOrder: 3 },
      { id: '71', title: 'Get a good night\'s sleep', category: 'day-before', timeframe: 'day before', sortOrder: 4 },
    ],
  },
  {
    id: 'wedding-day',
    name: 'Wedding Day',
    timeframe: 'wedding day',
    description: 'The big day!',
    items: [
      { id: '72', title: 'Eat breakfast!', category: 'wedding-day', timeframe: 'wedding day', sortOrder: 1 },
      { id: '73', title: 'Stay hydrated', category: 'wedding-day', timeframe: 'wedding day', sortOrder: 2 },
      { id: '74', title: 'Have snacks available for wedding party', category: 'wedding-day', timeframe: 'wedding day', sortOrder: 3 },
      { id: '75', title: 'Enjoy every moment', category: 'wedding-day', timeframe: 'wedding day', sortOrder: 4 },
    ],
  },
  {
    id: 'after-wedding',
    name: 'After Wedding',
    timeframe: 'after wedding',
    description: 'Don\'t forget these important post-wedding tasks!',
    items: [
      { id: '76', title: 'Send thank-you cards within 3 months', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 1 },
      { id: '77', title: 'Return rentals', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 2 },
      { id: '78', title: 'Settle final vendor payments', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 3 },
      { id: '79', title: 'Update name on documents (if changing)', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 4 },
      { id: '80', title: 'Order wedding album', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 5 },
      { id: '81', title: 'Preserve dress (if desired)', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 6 },
      { id: '82', title: 'Write reviews for great vendors', category: 'after-wedding', timeframe: 'after wedding', sortOrder: 7 },
    ],
  },
]

export function getAllChecklistItems(): ChecklistItem[] {
  return defaultChecklist.flatMap((category) => category.items)
}

export function getChecklistItemById(id: string): ChecklistItem | undefined {
  return getAllChecklistItems().find((item) => item.id === id)
}
