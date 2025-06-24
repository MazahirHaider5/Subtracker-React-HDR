import React ,{useState} from 'react';
import '../assets/style/globals.css';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody
} from 'reactstrap'

const FAQs = () => {
  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };


  return (
    <>
      <p className='page-heading fs-20  '>Got questions? We've got answers! Check out our Frequently Asked Questions for more information.</p>
      <h2 className='fs-20 fw-600 mt-2'> Frequently Asked Questions</h2>
      <div  className='mt-2 mb-5'>
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId="1">What are the main features of the dashboard?</AccordionHeader>
            <AccordionBody accordionId="1">
           <p className='fs-16'>The dashboard provides a centralized view of all your subscriptions, including detailed information on costs, renewal dates, and alerts. It shows your monthly spending and provides insights into your subscription usage, helps you avoid unexpected costs, and offers optimization suggestions to maximize savings.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="2">How does subscription management help?</AccordionHeader>
            <AccordionBody accordionId="2">
            <p className='fs-16'>SubTracker allows you to manage all your subscriptions in one central location. You can add new subscriptions, edit or remove existing ones, and upload documents such as contracts. This makes it easier to monitor your subscriptions and helps you keep track of your spending.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="3">What notifications does SubTracker offer?</AccordionHeader>
            <AccordionBody accordionId="3">
            <p className='fs-16'>SubTracker sends you timely reminders of upcoming renewals, payment deadlines and contract expirations. You can receive notifications via email or in-app notifications to make sure you don't miss any important deadlines.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="4">Can I cancel my subscription at any time?</AccordionHeader>
            <AccordionBody accordionId="4">
            <p className='fs-16'>Yes, you can cancel your subscription at any time. This can be done easily through your user account or by contacting our support team. After cancellation, you will continue to have access to your data until the end of the current billing period.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="5">How can I analyze costs?</AccordionHeader>
            <AccordionBody accordionId="5">
            <p className='fs-16'>Use detailed analytics and reports to monitor your subscription costs and identify savings potential.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="6">What payment methods are accepted?</AccordionHeader>
            <AccordionBody accordionId="6">
            <p className='fs-16'>We accept all major payment methods, including credit cards, debit cards and other electronic payments via Stripe. You can store and manage your preferred payment method in your user account.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="7">How secure is my data?</AccordionHeader>
            <AccordionBody accordionId="7">
            <p className='fs-16'>Your data is safe with us. SubTracker uses modern technologies to protect your data both in transit and at rest. We strictly adhere to GDPR and FADP guidelines to ensure your privacy and data security.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="8">Is there a web and mobile version of SubTracker?</AccordionHeader>
            <AccordionBody accordionId="8">
            <p className='fs-16'>Yes, SubTracker is available in both web and mobile versions. The mobile version is ideal for personal use and offers all the basic features to manage your subscriptions on the go. The web version, which will be available soon, is aimed at corporate needs and offers advanced features for subscription management and financial reporting.</p>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>

    </>
  );
};

export default FAQs;