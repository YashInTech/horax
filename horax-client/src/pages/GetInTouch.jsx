import React, { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from 'react-icons/fa';

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      // Replace with actual API call when ready
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitMessage('Thank you! Your message has been sent successfully.');
      setMessageType('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Hero Section */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Get In Touch</h1>
        <p className='text-xl text-gray-600'>
          We'd love to hear from you. Here's how you can reach us.
        </p>
        <div className='w-24 h-1 mx-auto bg-black mt-6'></div>
      </div>

      <div className='flex flex-col lg:flex-row gap-10 mb-16'>
        {/* Contact Form */}
        <div className='lg:w-2/3'>
          <div className='bg-white rounded-lg shadow-lg p-8'>
            <h2 className='text-2xl font-semibold mb-6'>Send Us a Message</h2>

            {submitMessage && (
              <div
                className={`p-4 mb-6 rounded ${
                  messageType === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div>
                  <label htmlFor='name' className='block text-gray-700 mb-2'>
                    Your Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='email' className='block text-gray-700 mb-2'>
                    Your Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                    required
                  />
                </div>
              </div>

              <div className='mb-6'>
                <label htmlFor='subject' className='block text-gray-700 mb-2'>
                  Subject
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                />
              </div>

              <div className='mb-6'>
                <label htmlFor='message' className='block text-gray-700 mb-2'>
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  rows='6'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                  required
                ></textarea>
              </div>

              <button
                type='submit'
                className='bg-black text-black py-3 px-6 rounded-md hover:bg-[#141414] transition duration-300 flex items-center justify-center'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className='inline-flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className='inline-flex text-white items-center'>
                    <FaPaperPlane className='mr-2' /> Send Message
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className='lg:w-1/3'>
          <div className='bg-[#141414] text-white rounded-lg shadow-lg p-8 h-full'>
            <h2 className='text-2xl font-semibold mb-8'>Contact Information</h2>

            <div className='space-y-6'>
              <div className='flex items-start'>
                <FaMapMarkerAlt className='text-2xl mr-4 mt-1' />
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Our Location</h3>
                  <p>123 Commerce Street</p>
                  <p>New Delhi, 110001</p>
                  <p>India</p>
                </div>
              </div>

              <div className='flex items-start'>
                <FaPhone className='text-2xl mr-4 mt-1' />
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Phone</h3>
                  <p>+91 98765 43210</p>
                  <p>+91 11 2345 6789</p>
                </div>
              </div>

              <div className='flex items-start'>
                <FaEnvelope className='text-2xl mr-4 mt-1' />
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Email</h3>
                  <p>info@horax.com</p>
                  <p>support@horax.com</p>
                </div>
              </div>

              <div className='flex items-start'>
                <FaClock className='text-2xl mr-4 mt-1' />
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className='mb-16'>
        <h2 className='text-3xl font-semibold mb-6 text-center'>Find Us</h2>
        <div className='rounded-lg overflow-hidden shadow-lg h-96'>
          {/* Replace with your actual Google Maps embed code */}
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6731570223807!2d77.20659261508358!3d28.64272088241254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f5!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1621441457357!5m2!1sen!2sin'
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen=''
            loading='lazy'
            title='Horax Location'
          ></iframe>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='bg-gray-800 p-8 rounded-lg'>
        <h2 className='text-3xl text-white font-semibold mb-8 text-center'>
          Frequently Asked Questions
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-xl font-semibold mb-3'>
              What are your shipping options?
            </h3>
            <p className='text-gray-600'>
              We offer standard shipping (3-5 business days), express shipping
              (1-2 business days), and next-day delivery options for most
              locations across India.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-xl font-semibold mb-3'>
              How can I track my order?
            </h3>
            <p className='text-gray-600'>
              Once your order ships, you'll receive a tracking number via email.
              You can also log into your account to track your order status.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-xl font-semibold mb-3'>
              What is your return policy?
            </h3>
            <p className='text-gray-600'>
              We accept returns within 30 days of purchase. Items must be unused
              and in original packaging. Please contact our customer service for
              return authorization.
            </p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-xl font-semibold mb-3'>
              Do you offer international shipping?
            </h3>
            <p className='text-gray-600'>
              Yes, we ship internationally to select countries. Additional
              shipping fees and customs duties may apply depending on your
              location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
