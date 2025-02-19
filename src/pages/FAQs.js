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
      <div>
        <Accordion open={open} toggle={toggle}>
          <AccordionItem>
            <AccordionHeader targetId="1">Lorem ipsum dolor sit ?</AccordionHeader>
            <AccordionBody accordionId="1">
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
          
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p> <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="2">Lorem ipsum dolor sit ?</AccordionHeader>
            <AccordionBody accordionId="2">
            <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
          
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p> <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="3">Lorem ipsum dolor sit ?</AccordionHeader>
            <AccordionBody accordionId="3">
            <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
          
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
           <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p> <p className='fs-16'> Lorem ipsum dolor sit amet consectetur. Auctor urna et at faucibus cras. Consectetur sed lorem aliquet adipiscing sit in porttitor viverra. Erat maecenas euismod a dictum. Interdum massa senectus ultricies malesuada scelerisque sed.</p>
            
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>

    </>
  );
};

export default FAQs;
