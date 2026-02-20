
import { useState } from "react";
import { send } from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";

// Images
import SoilImage from "../assets/soil.jpg";
import PlantImage from "../assets/plant.jpg";
import FeedImage from "../assets/feed.jpg";
import FoodImage from "../assets/food.jpg";
import FertilizerImage from "../assets/fertilizer.jpg";
import CompostImage from "../assets/compost.jpg";
import WaterImage from "../assets/water.jpg";
import EffluentImage from "../assets/effluent.jpg";
import ResearchImage from "../assets/research.jpg";

// Dynamic Configuration
const SERVICES_CONFIG = {
  // EmailJS Configuration
  email: {
    serviceId: "service_rapdvl1",
    templateId: "template_u5kurba",
    publicKey: "NwiBom_kjZvpQfXpR",
    enabled: true
  },

  // WhatsApp Configuration (alternative to email)
  whatsapp: {
    enabled: false,
    number: "+254736351633",
    messageTemplate: "Hello, I would like to request: {service}"
  },

  // UI Configuration
  ui: {
    grid: {
      cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      gap: "gap-6"
    },
    card: {
      bg: "bg-white",
      shadow: "shadow-lg hover:shadow-xl",
      rounded: "rounded-lg",
      padding: "p-6",
      transition: "transition-all duration-300"
    },
    buttons: {
      primary: {
        bg: "bg-green-600 hover:bg-green-700",
        text: "text-white",
        rounded: "rounded-lg",
        padding: "py-2 px-4"
      },
      secondary: {
        bg: "bg-blue-600 hover:bg-blue-700",
        text: "text-white",
        rounded: "rounded-lg",
        padding: "py-2 px-4"
      },
      tertiary: {
        bg: "bg-gray-300 hover:bg-gray-400",
        text: "text-gray-800",
        rounded: "rounded-lg",
        padding: "py-2 px-4"
      }
    },
    modal: {
      overlay: "bg-black/60 backdrop-blur-sm",
      container: "bg-white rounded-xl max-w-3xl w-full p-6 relative",
      animation: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.2 }
      }
    }
  },

  // Text Configuration
  text: {
    section: {
      title: "Our Laboratory Services",
      subtitle: "Click a service to view details or request it."
    },
    buttons: {
      viewDetails: "View Details",
      requestService: "Request Service",
      close: "Close",
      back: "Back to Details",
      submit: "Submit Request",
      sending: "Sending..."
    },
    form: {
      namePlaceholder: "Full Name",
      emailPlaceholder: "Email",
      detailsPlaceholder: "Request details",
      successMessage: "Your request for {service} has been sent!",
      errorMessage: "Failed to send request. Please try again later."
    },
    table: {
      analysisName: "Analysis Name",
      parameters: "Parameters Included"
    }
  },

  // Features
  features: {
    showImages: true,
    showTables: true,
    showDescription: true,
    truncateDescription: true,
    descriptionLength: 100,
    modalImages: true,
    enableEmail: true,
    enableWhatsApp: false,
    animations: true,
    showSearch: true,
    showFilters: true
  }
};

// Default Service Data
const DEFAULT_SERVICES = [
  {
    id: "soil",
    title: "Soil Analysis",
    description: "Our soil test covers pH and Mineral contents (chemical analysis) of a sample. These are done to optimize crop production and environmental conservation as well as management. Soil analyses are done during environmental monitoring and diagnosis when challenges manifest. IAL has provided latest techniques and methodologies to foster fast, reliable and accurate soil chemical analysis. Based on the test results, we are able to offer sustainable advice to our clients.",
    shortDescription: "Comprehensive soil testing for optimal crop production",
    table: [
      { name: "Total nitrogen", parameters: "N" },
      { name: "Soil pH", parameters: "pH" },
      { name: "Basic soil analysis", parameters: "pH, P, K, Ca, Mg, Na, OM, N, CEC" },
      { name: "Complete soil analysis", parameters: "pH, EC, P, K, Ca, Mg, S, Na, Fe, Mn, B, Cu, Zn, CEC, N, OM" },
    ],
    image: SoilImage,
    icon: "🌱",
    category: "agriculture",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "plant",
    title: "Plant Tissue Analysis",
    description: "Plant tissues analysis is the determination of nutritional content of plant partition in order to ascertain its chemical composition for correction and monitoring of deficiency. IAL has provided latest technologies and methodologies to foster fast, reliable and accurate chemical plant tissue analysis. Based on test results, we are able to offer sustainable advices to our clients.",
    shortDescription: "Determine nutritional content of plant tissues",
    table: [
      { name: "Total nitrogen", parameters: "N" },
      { name: "Leaf analysis", parameters: "N, P, K, Ca, Mg, S, Na, Fe, Mn, B, MO, Zn" },
      { name: "Heavy metals in plant", parameters: "Ag, B, Cd, Cu, Pb, Zn, Cr, Ni" },
    ],
    image: PlantImage,
    icon: "🌿",
    category: "agriculture",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "feed",
    title: "Animal Feed Analysis",
    description: "Animal feeds analysis at IAL entails physical, biological and chemical characteristics of various food products. Animal feeds are analyzed to determine their quality, composition, and safety. IAL has established a state-of-the-art testing facility for handling feed products in respect to physical and chemical analysis. Feed analyses are done for quality monitoring and safety aspects. Our test report can also assist clients in subsequent formulation needs of their products as well as animal feeding decisions.",
    shortDescription: "Quality and safety analysis of animal feeds",
    table: [
      { name: "Mineral elements in feeds", parameters: "P, K, Ca, Mg, S, Fe, Mn, B, Cu, Mo, Zn" },
      { name: "Heavy metals analysis", parameters: "Cu, Cd, Pb, Co, B, Ni, Zn, Cr, As" },
      { name: "Mineral lick analysis", parameters: "Na, Cl, Cd, Ca, Mg, P, S, Mn, Fe, Zn, Cu, Mo, Co" },
    ],
    image: FeedImage,
    icon: "🐄",
    category: "livestock",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "food",
    title: "Food Analysis",
    description: "Human food analysis at IAL entails physical, biological and chemical characteristics of various products. Food for human consumption is analyzed to determine its quality and safety. IAL has established a state-of-the-art testing facility for handling food products in respect to physical and chemical analysis. Food analyses are done for quality monitoring and safety aspects. Our test report can be used for onward decision making by stakeholders.",
    shortDescription: "Quality and safety testing for human food",
    image: FoodImage,
    icon: "🍎",
    category: "food",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "fertilizer",
    title: "Fertilizer Analysis",
    description: "Fertilizers are analyzed to determine the quality and chemical composition. Fertilizer nutrition content helps in plant development and improves overall yield of the crop. IAL uses instrumental methods of fertilizer analysis to obtain accurate, reliable, and credible fertilizer results for our clients. Based on the fertilizer test reports, we are able to provide technical recommendations on the application rates on various types of fertilizer used in crops such as tea, sugarcane, coffee, maize, beans, avocado, etc.",
    shortDescription: "Quality and composition analysis of fertilizers",
    image: FertilizerImage,
    icon: "🧪",
    category: "agriculture",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "compost",
    title: "Compost / Manure Analysis",
    description: "Organic matter evaluation supporting sustainable soil management. IAL provides comprehensive analysis for compost and manure to ensure quality and nutrient content for agricultural use.",
    shortDescription: "Organic matter evaluation for soil management",
    image: CompostImage,
    icon: "🌿",
    category: "agriculture",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "water",
    title: "Water Analysis",
    description: "Our water tests cover physical, biological, and chemical tests for various types (raw, potable, and effluent) to determine their suitability for purpose. IAL has deployed modern methodologies and techniques for the analysis of water samples. Our clients can have an edge in terms of turnaround time, accuracy, and reliable results from our modern laboratory.",
    shortDescription: "Comprehensive water quality testing",
    table: [
      { name: "Microbial", parameters: "Coliforms, E.coli, TVC, Salmonella" },
      { name: "Complete irrigation water", parameters: "pH, Na, Al, Ca, Mg, Cl, EC, TDS, S, Ni, P, K, B, SO4, Total nitrogen, NH4" },
      { name: "Heavy metals analysis", parameters: "As, Cd, B, Se, Cu, Zn, Pb, Cr, B, Ni, Mn, Fr" },
      { name: "NEMA drinking water", parameters: "pH, TSS, NO3, NH4, TDS, E.coli, Coliforms, Cd, Pb, Cu, Zn" },
    ],
    image: WaterImage,
    icon: "💧",
    category: "environmental",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "effluent",
    title: "NEMA Effluent Analysis",
    description: "Environmental discharge testing meeting regulatory compliance standards. IAL conducts effluent analyses for industries to ensure safe and compliant disposal of wastewater.",
    shortDescription: "Regulatory compliance testing for wastewater",
    image: EffluentImage,
    icon: "🏭",
    category: "environmental",
    price: "Contact for pricing",
    turnaround: "1-7 days"
  },
  {
    id: "research",
    title: "Research Analysis for University and Colleges",
    description: "Advanced analytical support for universities, colleges, and research institutions. IAL provides specialized tests for research purposes to ensure accuracy and reliability.",
    shortDescription: "Advanced analytical support for research",
    table: [
      { name: "Heavy Metals Analysis", parameters: "Se, Ni, Pb, Cd, Co, Cr, Zn" },
    ],
    image: ResearchImage,
    icon: "🔬",
    category: "research",
    price: "Contact for pricing",
    turnaround: "Custom"
  }
];

// Category colors for badges
const CATEGORY_COLORS = {
  agriculture: "bg-green-100 text-green-800",
  livestock: "bg-yellow-100 text-yellow-800",
  food: "bg-red-100 text-red-800",
  environmental: "bg-blue-100 text-blue-800",
  research: "bg-purple-100 text-purple-800",
  default: "bg-gray-100 text-gray-800"
};

// Animation variants
const ANIMATIONS = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }
};

export default function Services({ 
  services = DEFAULT_SERVICES,
  config = SERVICES_CONFIG,
  customActions = {}
}) {
  const [modalService, setModalService] = useState(null);
  const [modalMode, setModalMode] = useState("details");
  const [formData, setFormData] = useState({ user_name: "", user_email: "", request_details: "" });
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories for filter
  const categories = ["all", ...new Set(services.map(s => s.category))];

  // Filter services based on category and search
  const filteredServices = services.filter(service => {
    const matchesCategory = filter === "all" || service.category === filter;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openDetails = (service) => {
    setModalService(service);
    setModalMode("details");
  };

  const openRequestForm = (service) => {
    setModalService(service);
    setModalMode("request");
  };

  const closeModal = () => {
    setModalService(null);
    setFormData({ user_name: "", user_email: "", request_details: "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!modalService) return;

    setSending(true);
    try {
      await send(
        config.email.serviceId,
        config.email.templateId,
        {
          user_name: formData.user_name,
          user_email: formData.user_email,
          service_name: modalService.title,
          request_details: formData.request_details,
        },
        config.email.publicKey
      );
      alert(config.text.form.successMessage.replace('{service}', modalService.title));
      closeModal();
    } catch (error) {
      console.error(error);
      alert(config.text.form.errorMessage);
    }
    setSending(false);
  };

  // Handle WhatsApp submission
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    if (!modalService) return;

    const message = config.whatsapp.messageTemplate
      .replace('{service}', modalService.title)
      .replace('{name}', formData.user_name)
      .replace('{details}', formData.request_details);

    const whatsappUrl = `https://wa.me/${config.whatsapp.number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeModal();
  };

  // Handle form submission based on enabled methods
  const handleSubmit = (e) => {
    if (config.email.enabled) {
      handleEmailSubmit(e);
    } else if (config.whatsapp.enabled) {
      handleWhatsAppSubmit(e);
    } else if (customActions.submit) {
      customActions.submit({ service: modalService, formData });
    }
  };

  // Render service card
  const renderServiceCard = (service, index) => {
    const Component = config.features.animations ? motion.div : 'div';
    const animationProps = config.features.animations ? {
      ...ANIMATIONS.card,
      transition: { ...ANIMATIONS.card.transition, delay: index * 0.1 }
    } : {};

    return (
      <Component
        key={service.id || index}
        className={`${config.ui.card.bg} ${config.ui.card.shadow} ${config.ui.card.rounded} ${config.ui.card.padding} ${config.ui.card.transition} flex flex-col justify-between`}
        {...animationProps}
      >
        {service.icon && (
          <div className="text-4xl mb-3">{service.icon}</div>
        )}
        
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
          {service.category && config.features.showFilters && (
            <span className={`text-xs px-2 py-1 rounded-full ${CATEGORY_COLORS[service.category] || CATEGORY_COLORS.default}`}>
              {service.category}
            </span>
          )}
        </div>

        {config.features.showDescription && (
          <p className="text-gray-600 mb-4">
            {config.features.truncateDescription 
              ? service.shortDescription || service.description.slice(0, config.features.descriptionLength) + '...'
              : service.description}
          </p>
        )}

        {service.turnaround && (
          <p className="text-sm text-gray-500 mb-2">⏱️ Turnaround: {service.turnaround}</p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => openDetails(service)}
            className={`flex-1 ${config.ui.buttons.secondary.bg} ${config.ui.buttons.secondary.text} ${config.ui.buttons.secondary.rounded} ${config.ui.buttons.secondary.padding} transition`}
          >
            {config.text.buttons.viewDetails}
          </button>
          <button
            onClick={() => openRequestForm(service)}
            className={`flex-1 ${config.ui.buttons.primary.bg} ${config.ui.buttons.primary.text} ${config.ui.buttons.primary.rounded} ${config.ui.buttons.primary.padding} transition`}
          >
            {config.text.buttons.requestService}
          </button>
        </div>
      </Component>
    );
  };

  // Render modal
  const renderModal = () => {
    if (!modalService) return null;

    const ModalComponent = config.features.animations ? motion.div : 'div';

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-auto">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <ModalComponent
            className={config.ui.modal.container}
            initial={config.features.animations ? config.ui.modal.animation.initial : {}}
            animate={config.features.animations ? config.ui.modal.animation.animate : {}}
            exit={config.features.animations ? config.ui.modal.animation.exit : {}}
            transition={config.features.animations ? config.ui.modal.animation.transition : {}}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold z-10"
            >
              ✕
            </button>

            {modalMode === "details" && (
              <>
                <h3 className="text-3xl font-bold text-green-700 mb-4 text-center">
                  {modalService.icon && <span className="mr-2">{modalService.icon}</span>}
                  {modalService.title}
                </h3>

                {config.features.modalImages && modalService.image && (
                  <img
                    src={modalService.image}
                    alt={modalService.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <p className="text-gray-700 mb-4">{modalService.description}</p>

                {modalService.turnaround && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Turnaround time:</strong> {modalService.turnaround}
                  </p>
                )}

                {config.features.showTables && modalService.table && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left border border-gray-300 rounded-lg">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2">{config.text.table.analysisName}</th>
                          <th className="px-4 py-2">{config.text.table.parameters}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {modalService.table.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-100">
                            <td className="px-4 py-2">{row.name}</td>
                            <td className="px-4 py-2">{row.parameters}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalMode("request")}
                    className={`flex-1 ${config.ui.buttons.primary.bg} ${config.ui.buttons.primary.text} ${config.ui.buttons.primary.rounded} ${config.ui.buttons.primary.padding} transition`}
                  >
                    {config.text.buttons.requestService}
                  </button>
                  <button
                    onClick={closeModal}
                    className={`flex-1 ${config.ui.buttons.tertiary.bg} ${config.ui.buttons.tertiary.text} ${config.ui.buttons.tertiary.rounded} ${config.ui.buttons.tertiary.padding} transition`}
                  >
                    {config.text.buttons.close}
                  </button>
                </div>
              </>
            )}

            {modalMode === "request" && (
              <>
                <h3 className="text-3xl font-bold text-green-700 mb-6 text-center">
                  Request {modalService.title}
                </h3>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="user_name"
                    placeholder={config.text.form.namePlaceholder}
                    required
                    value={formData.user_name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  
                  <input
                    type="email"
                    name="user_email"
                    placeholder={config.text.form.emailPlaceholder}
                    required
                    value={formData.user_email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  
                  <textarea
                    name="request_details"
                    placeholder={config.text.form.detailsPlaceholder}
                    rows="4"
                    required
                    value={formData.request_details}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  
                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full ${config.ui.buttons.primary.bg} ${config.ui.buttons.primary.text} ${config.ui.buttons.primary.rounded} ${config.ui.buttons.primary.padding} transition disabled:opacity-50`}
                  >
                    {sending ? config.text.buttons.sending : config.text.buttons.submit}
                  </button>
                </form>

                <button
                  onClick={() => setModalMode("details")}
                  className={`mt-4 w-full ${config.ui.buttons.tertiary.bg} ${config.ui.buttons.tertiary.text} ${config.ui.buttons.tertiary.rounded} ${config.ui.buttons.tertiary.padding} transition`}
                >
                  {config.text.buttons.back}
                </button>
              </>
            )}
          </ModalComponent>
        </div>
      </AnimatePresence>
    );
  };

  return (
    <section id="services" className="pt-24 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {config.features.animations ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
              {config.text.section.title}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {config.text.section.subtitle}
            </p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-center text-green-700 mb-6">
              {config.text.section.title}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {config.text.section.subtitle}
            </p>
          </>
        )}

        {/* Search and Filter Bar */}
        {(config.features.showSearch || config.features.showFilters) && (
          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {config.features.showFilters && (
              <div className="flex gap-2 flex-wrap justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full capitalize transition ${
                      filter === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            
            {config.features.showSearch && (
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-green-500"
              />
            )}
          </div>
        )}

        {/* Service Grid */}
        {filteredServices.length > 0 ? (
          <div className={`grid ${config.ui.grid.cols} ${config.ui.grid.gap}`}>
            {filteredServices.map((service, index) => renderServiceCard(service, index))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          </div>
        )}

        {/* Results count */}
        <p className="text-center text-gray-500 mt-6">
          Showing {filteredServices.length} of {services.length} services
        </p>
      </div>

      {renderModal()}
    </section>
  );
}