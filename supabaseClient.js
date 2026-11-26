// Cliente Supabase carregado no navegador pelo CDN global.
// Chave pública/anon apenas: nunca coloque service_role no frontend.
const supabaseUrl = 'https://tiitbvmfdrtmimwngwqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaXRidm1mZHJ0bWltd25nd3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyODUyMzksImV4cCI6MjExMDg2MTIzOX0.48R0JZQfn0oWBqxI2lH4Ljx1o4X2ISMNStSt-T7jmTc';

const supabaseLib = window.supabase;
window.supabase = supabaseLib.createClient(supabaseUrl, supabaseAnonKey);
