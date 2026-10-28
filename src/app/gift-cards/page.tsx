'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StoreNav } from '@/components/store-nav';
import { StoreFooter } from '@/components/store-footer';
import { useCart } from '@/lib/cart-context';
import { money } from '@/lib/kidobox-data';
import { Sparkles } from 'lucide-react';

export default function GiftCardsPage() {
  const { addItem, setIsOpen } = useCart();
  const [amount, setAmount] = useState(1000);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    addItem({
      product_id: 'gift-card',
      variant_id: `gift-card-${amount}`,
      title: `KIDOBOX Gift Card (${money(amount)})`,
      variant_title: message ? `“${message}”` : undefined,
      price: amount,
      image_url: '/assets/hd/clothing.webp',
    });
    setToastMessage(`KIDOBOX ${money(amount)} Gift Card added with love ♡`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" data-page="gift-cards">
      <StoreNav />

      <main id="main-content" className="container inner-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">A Little Gift of Choice</span>
        </nav>

        <div className="gift-layout">
          <div className="gift-visual">
            <span className="gift-sparkle">
              <Sparkles size={70} color="#ffd44d" />
            </span>
            <img src="/logo.png" alt="KIDOBOX Gift Card" style={{ maxHeight: '45px', width: 'auto' }} />
            <h2>A Little Gift Card</h2>
            <p>For diapers, soft rompers, toys &amp; sweet nursery favorites.</p>
            <div className="gift-card-bottom">
              <span>LITTLE NEEDS. BIG SMILES.</span>
              <strong>{money(amount)}</strong>
            </div>
          </div>

          <form className="gift-form" onSubmit={handleAddGiftCard}>
            <span className="mini-eyebrow">A LOVELY SURPRISE</span>
            <h2>Send a Little Gift of Choice</h2>
            <p>Give new and expecting parents the freedom to choose what their little one needs most.</p>

            <fieldset>
              <legend>Select Gift Card Amount</legend>
              <div className="choice-row">
                {[500, 1000, 2000, 5000].map((val) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name="amount"
                      value={val}
                      checked={amount === val}
                      onChange={() => setAmount(val)}
                    />
                    <span>{money(val)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              Recipient’s name or email
              <input
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. ananya@example.com"
              />
            </label>

            <label>
              Personal message <span className="optional">(optional)</span>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a sweet little note for the family..."
              />
            </label>

            <button type="submit" className="button pink full-width" style={{ marginTop: '20px' }}>
              Add Gift Card ({money(amount)}) to Bag →
            </button>
          </form>
        </div>
      </main>

      <StoreFooter />

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status">
        <span>{toastMessage}</span>
        <button
          onClick={() => setIsOpen(true)}
          style={{ color: '#ffbbd9', textDecoration: 'underline', marginLeft: '10px', background: 'none', border: 0, font: 'inherit', cursor: 'pointer' }}
        >
          View Bag →
        </button>
      </div>
    </div>
  );
}
