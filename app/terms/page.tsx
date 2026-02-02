'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FaFileContract, FaCheckCircle, FaUndo, FaPhoneAlt } from 'react-icons/fa';

export default function TermsAndConditions() {
  const [termsContent, setTermsContent] = useState('');
  const [contact, setContact] = useState({ phoneNumber: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const aboutSnap = await getDoc(doc(db, 'site_settings', 'about_page'));
      const contactSnap = await getDoc(doc(db, 'site_settings', 'engagement_config'));
      
      if (aboutSnap.exists()) setTermsContent(aboutSnap.data().termsOfService);
      if (contactSnap.exists()) setContact({ phoneNumber: contactSnap.data().phoneNumber });
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold animate-pulse text-blue-600">LOADING TERMS...</div>;

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 px-6 md:px-20 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
          <FaFileContract size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Terms of <span className="text-blue-600">Service</span></h1>
      </div>

      <div className="space-y-10 text-gray-600 leading-relaxed">
        {/* DYNAMIC CONTENT FROM DB */}
        <section className="border-l-4 border-blue-500 pl-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 uppercase mb-4">Official Agreement</h2>
          <div className="whitespace-pre-wrap">
            {termsContent || "Our terms of service are currently being updated."}
          </div>
        </section>

        <section className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 uppercase mb-4 flex items-center gap-2">
            <FaUndo className="text-blue-600" /> Refund & Satisfaction Guarantee
          </h2>
          <p className="font-medium text-gray-800 mb-4">
            At GC WAB, we stand behind the quality of our luxury goods. 
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
              <p><strong>Fashion:</strong> Refunds or exchanges valid within 48 hours if quality standards are not met.</p>
            </div>
            <div className="flex gap-4">
              <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
              <p><strong>Automotive:</strong> 100% deposit refund if the vehicle deviates from the inspection report.</p>
            </div>
          </div>
        </section>

        <section className="border-t pt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Need immediate clarification?</p>
          <a href={`tel:${contact.phoneNumber}`} className="flex items-center gap-2 text-blue-600 font-black hover:underline text-lg">
            <FaPhoneAlt /> {contact.phoneNumber}
          </a>
        </section>
      </div>
    </div>
  );
}