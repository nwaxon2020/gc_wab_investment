'use client';

import { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaCalculator, FaCheckCircle, FaShieldAlt, FaLightbulb, FaPhoneAlt, FaDownload } from 'react-icons/fa';

export default function EngagementSectionUi() {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [months, setMonths] = useState(12);
  
  // --- DYNAMIC CONFIG STATE WITH FALLBACKS ---
  const [config, setConfig] = useState({
    phoneNumber: "+2347034632037",
    rate6m: 1.10,
    rate12m: 1.15,
    rate24m: 1.25,
    rate36m: 1.35
  });

  // Fetch Live Config from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'engagement_config'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          // Use DB value OR fallback to hardcoded original
          phoneNumber: data.phoneNumber || "+2347034632037",
          rate6m: data.rate6m || 1.10,
          rate12m: data.rate12m || 1.15,
          rate24m: data.rate24m || 1.25,
          rate36m: data.rate36m || 1.35
        });
      }
    });
    return () => unsub();
  }, []);

  // --- LOGIC: DYNAMIC INTEREST CALCULATION USING CONFIG ---
  const monthlyPayment = useMemo(() => {
    let interestMultiplier = config.rate6m; // Default to 6M rate
    
    if (months === 12) interestMultiplier = config.rate12m;
    if (months === 24) interestMultiplier = config.rate24m;
    if (months === 36) interestMultiplier = config.rate36m;

    return Math.round((loanAmount * interestMultiplier) / months);
  }, [loanAmount, months, config]);

  const downloadChecklist = () => {
    const checklistContent = `
PRE-PURCHASE CAR INSPECTION CHECKLIST (NIGERIAN MARKET)
-------------------------------------------------------
1. DOCUMENTATION
   [ ] Customs C-Number verified on portal
   [ ] Original Logbook/Title present
   [ ] VIN matches across all documents

2. ENGINE & MECHANICAL
   [ ] Cold start: No blue/black smoke
   [ ] Engine oil color: Not milky or burnt
   [ ] Transmission: Smooth gear shifting
   [ ] No active dashboard warning lights

3. EXTERIOR & INTERIOR
   [ ] Suspension: No rattles on bumpy roads
   [ ] AC: Chills within 2 minutes
   [ ] Under-chassis: No signs of rust or flooding
   [ ] Body paint: Uniform color (no 'overspray')

Stay safe and buy smart!
Generated from your Car Collection App.
    `;

    const element = document.createElement("a");
    const file = new Blob([checklistContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Car_Inspection_Checklist.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="max-w-7xl mx-auto my-10 px-2 md:px-0">
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* 1. INTERACTIVE LOAN CALCULATOR */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-black p-4 py-6 md:p-8 rounded-xl border border-emerald-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <FaCalculator className="text-emerald-400 text-2xl" />
            <h3 className="text-xl font-bold text-white">Financing Estimator</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">Planning to pay in installments? Estimate your monthly payout here.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 text-white">Price Amount (₦)</label>
              <input 
                type="range" min="500000" max="15000000" step="100000" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="text-emerald-400 font-bold mt-2">₦{loanAmount.toLocaleString()}</div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 text-white">Duration ({months} Months)</label>
              <div className="flex gap-2">
                {[6, 12, 24, 36].map((m) => (
                  <button 
                    key={m} 
                    onClick={() => setMonths(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${months === m ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-emerald-500/50'}`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-center">
              <span className="text-gray-400 text-xs uppercase block mb-1">Estimated Monthly Pay</span>
              <span className="text-2xl font-black text-emerald-400">₦{monthlyPayment.toLocaleString()}*</span>
              <p className="text-[10px] text-gray-500 mt-2 italic">
                *Includes dynamic interest based on term set by admin.
              </p>
            </div>
          </div>
        </div>

        {/* 2. BUYER'S PRO-TIPS */}
        <div className="bg-gray-900/40 p-4 py-8 md:p-8 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaLightbulb className="text-amber-400 text-2xl" />
              <h3 className="text-xl font-bold text-white">Tokunbo Buying Tips</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Verify Customs Papers", desc: "Always confirm the C-number on the customs portal to avoid impoundment." },
                { title: "Check the VIN", desc: "Run a VIN check to see the car's history before it arrived in Nigeria." },
                { title: "Cold Start Test", desc: "Watch the exhaust smoke during the first start of the day for engine health." },
                { title: "AC & Suspension", desc: "Test the AC while driving on a bumpy road to check for suspension rattles." }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-2xl transition-all cursor-default">
                  <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={downloadChecklist}
            className="text-left w-full mt-6 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-white flex items-center justify-center gap-4"
          >
            <FaDownload className="text-emerald-400" />
            <span className='flex'><span className='hidden md:block mr-1.5'>Download</span>Inspection Checklist</span>
          </button>
        </div>
      </div>

      {/* 3. TRUST BANNER */}
      <div className="mt-12 bg-emerald-600 rounded-xl p-8  flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-900/20">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">100% Verified Documents</h3>
            <p className="text-emerald-100 text-sm">Every car listed here has been physically inspected by our team.</p>
          </div>
        </div>
        
        <a 
          href={`tel:${config.phoneNumber}`}
          className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tighter hover:scale-105 transition-transform flex items-center gap-3 shadow-xl"
        >
          <FaPhoneAlt />
          Talk to an Expert
        </a>
      </div>
    </section>
  );
}