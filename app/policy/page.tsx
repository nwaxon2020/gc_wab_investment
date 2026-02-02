'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaShieldAlt, FaGoogle, FaUserLock, FaDatabase, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPolicy() {
  const [policyContent, setPolicyContent] = useState('');
  const [contact, setContact] = useState({ email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const aboutSnap = await getDoc(doc(db, 'site_settings', 'about_page'));
      const contactSnap = await getDoc(doc(db, 'site_settings', 'engagement_config'));
      
      if (aboutSnap.exists()) setPolicyContent(aboutSnap.data().privacyPolicy);
      if (contactSnap.exists()) setContact({ email: contactSnap.data().email });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold animate-pulse text-emerald-600">LOADING POLICIES...</div>;

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 px-6 md:px-20 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
          <FaShieldAlt size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Privacy <span className="text-emerald-600">Policy</span></h1>
      </div>

      <div className="space-y-10 text-gray-600 leading-relaxed">
        {/* DYNAMIC CONTENT FROM DB */}
        <section className="prose prose-emerald max-w-none">
          <div className="whitespace-pre-wrap font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10">
            {policyContent || "Our privacy policy details are being updated. Please check back shortly."}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 uppercase mb-4 flex flex-col md:flex-row items-center gap-2">
            <span className='flex items-center justify-center'><FaGoogle className="text-red-500" />oogle</span> Information Collection
          </h2>
          <p>
            To ensure a seamless and secure luxury experience, GC WAB uses <strong>Google Authentication</strong> as our primary gateway. We only access your basic profile to personalize your experience.
          </p>
        </section>

        <section className="border-t pt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Questions regarding your data?</p>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-emerald-600 font-black hover:underline">
            <FaEnvelope /> {contact.email}
          </a>
        </section>
      </div>
    </div>
  );
}