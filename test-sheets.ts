import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getGifts, getMessages } from './lib/googleSheets';

async function test() {
    try {
        console.log('Testing Gifts Connection...');
        const gifts = await getGifts();
        console.log(`Found ${gifts.length} gifts`);
        if (gifts.length > 0) console.log('First gift:', gifts[0]);

        console.log('\nTesting Messages Connection...');
        const messages = await getMessages();
        console.log(`Found ${messages.length} messages`);
        if (messages.length > 0) console.log('First message:', messages[0]);

    } catch (error: any) {
        console.error('ERROR:', error.message);
        if (error.errors) console.error(JSON.stringify(error.errors, null, 2));
    }
}

test();
