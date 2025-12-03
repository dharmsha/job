const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      description: 'Sign up as job seeker or institute',
      icon: '👤'
    },
    {
      number: '02',
      title: 'Search or Post',
      description: 'Find jobs or post vacancies',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Apply/Shortlist',
      description: 'Apply for jobs or shortlist candidates',
      icon: '📝'
    },
    {
      number: '04',
      title: 'Get Hired/Hire',
      description: 'Connect and start working',
      icon: '✅'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple 4-step process to find your perfect job or candidate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-5xl font-bold text-primary-100 mb-2">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-primary-200 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;