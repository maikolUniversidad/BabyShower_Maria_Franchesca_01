export interface Gift {
    gift_id: string;
    title: string;
    store_url: string;
    notes?: string;
    image_url?: string;
    type?: 'unique' | 'unlimited';
    status: 'available' | 'claimed' | 'disqualified';
    claimed_by?: string;
    claimed_phone?: string;
    claimed_email?: string;
    claimed_at?: string;
}

export interface RSVP {
    timestamp: string;
    name: string;
    phone: string;
    email?: string;
    attending: boolean; // converted from string "yes"/"no"
    guest_count: number;
    notes?: string;
}

export interface Message {
    timestamp: string;
    name: string;
    message: string;
}

export type SheetTab = 'Gifts' | 'RSVP' | 'Messages';
