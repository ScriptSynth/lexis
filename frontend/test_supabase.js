const { createClient } = require('@supabase/supabase-js');

const url = 'https://fyvunrmzjgvcczxhjavd.supabase.co';
const key = 'sb_publishable_tOiMgMJwdfQVLFB6kgqNUQ_oiReT1J-';

try {
    console.log("Initializing Supabase...");
    const supabase = createClient(url, key);
    console.log("Supabase initialized successfully.");
} catch (error) {
    console.error("Initialization failed:", error);
}
