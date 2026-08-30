import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Utensils,
  GlassWater,
  Calendar,
  Sparkles,
  Search,
  Check,
  Download,
  ChevronRight,
  Wine,
  Clock,
  Users,
  Heart,
  X,
  Info,
  Award,
  Flame,
  Leaf,
  Eye,
  FileText,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../context/LanguageContext';

const MENU_DATA = {
  degustationCourses: [
    {
      courseNumber: "Course 1",
      courseType: "Amuse-Bouche",
      nameVi: "Bánh Giòn Caviar Hoàng Gia & Kem Trứng Nhum Biển",
      nameEn: "Royal Baeri Caviar Tartlet with Sea Urchin Sabayon",
      nameFr: "Tartelette de Caviar Royal & Sabayon d'Oursin",
      descVi: "Vỏ bánh tart ngàn lớp giòn rụm kết hợp nhum biển Phú Quốc và trứng cá tầm muối Baeri đen nhánh, điểm xuyết vàng lá 24k.",
      descEn: "Delicate mille-feuille tartlet layered with Phu Quoc uni and glistening Baeri caviar, crowned with 24k edible gold leaf.",
      pairingVi: "Champagne Dom Pérignon Vintage 2015",
      pairingEn: "Champagne Dom Pérignon Vintage 2015",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
      tags: ["Chef Signature", "Seafood", "Gluten-Free"],
      calories: "140 kcal",
      techniqueVi: "Ủ lạnh nito lỏng và gia công vàng lá thủ công",
      techniqueEn: "Liquid nitrogen chill & hand-gilded 24k gold finish",
    },
    {
      courseNumber: "Course 2",
      courseType: "L'Entrée Froide",
      nameVi: "Carpaccio Sò Điệp Hokkaido & Nước Cốt Cam Sành Hà Giang",
      nameEn: "Hokkaido Scallop Carpaccio with Ha Giang Wild Citrus",
      descVi: "Sò điệp tươi cùi dày cắt lát mỏng tang, dầu ngò rí, thạch củ dền hồng và nước sốt cam sành tươi mát.",
      descEn: "Thinly sliced sashimi-grade scallop, coriander oil, ruby beet emulsion, and cold-pressed highland citrus vinaigrette.",
      pairingVi: "Chablis Premier Cru 'Montmains' Domaine Laroche 2020",
      pairingEn: "Chablis Premier Cru 'Montmains' Domaine Laroche 2020",
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=1000&auto=format&fit=crop",
      tags: ["Seafood", "Gluten-Free"],
      calories: "180 kcal",
      techniqueVi: "Sous-vide nhiệt độ cực thấp và ép lạnh hữu cơ",
      techniqueEn: "Ultra-low temperature sous-vide & cold-pressed emulsion",
    },
    {
      courseNumber: "Course 3",
      courseType: "L'Entrée Chaude",
      nameVi: "Gan Ngỗng Áp Chảo Rougié & Sốt Rượu Vang Đỏ Mận Mộc Châu",
      nameEn: "Pan-Seared Rougié Foie Gras with Moc Chau Plum Gastrique",
      descVi: "Gan ngỗng béo ngậy áp chảo xém cạnh, ăn kèm bánh brioche nướng bơ tỏi và mận Tây Bắc ngâm rượu porto.",
      descEn: "Crisp caramelized French foie gras paired with toasted brioche and port-macerated highland plums.",
      pairingVi: "Château d'Yquem Premier Cru Supérieur Sauternes 2011",
      pairingEn: "Château d'Yquem Premier Cru Supérieur Sauternes 2011",
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop",
      tags: ["Chef Signature"],
      calories: "320 kcal",
      techniqueVi: "Áp chảo lửa cao 45 giây và khử men rượu vang Port",
      techniqueEn: "High-heat 45-second sear & Port wine reduction glaze",
    },
    {
      courseNumber: "Course 4",
      courseType: "Le Poisson",
      nameVi: "Cá Tuyết Chile Đút Lò & Nước Dùng Nấm Truffle Đen",
      nameEn: "Glazed Glacier 51 Toothfish in Black Truffle Consommé",
      descVi: "Cá tuyết nướng men miso mật ong hoa cà phê, bơi trong nước dùng nấm tiêu rừng và nấm truffle tươi bào sợi.",
      descEn: "Honey-miso glazed Patagonian toothfish resting in an intensely aromatic wild forest truffle consommé.",
      pairingVi: "Puligny-Montrachet Domaine Leflaive 2019",
      pairingEn: "Puligny-Montrachet Domaine Leflaive 2019",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop",
      tags: ["Chef Signature", "Seafood"],
      calories: "290 kcal",
      techniqueVi: "Nướng than Binchotan Nhật Bản & trích ly nấm 12 giờ",
      techniqueEn: "Japanese Binchotan charcoal grill & 12-hour truffle extraction",
    },
    {
      courseNumber: "Course 5",
      courseType: "La Pièce Principale",
      nameVi: "Thăn Ngoại Bò Wagyu A5 Miyazaki & Tỏi Đen Lý Sơn",
      nameEn: "A5 Miyazaki Wagyu Sirloin with Ly Son Black Garlic Glaze",
      descVi: "Thịt bò cẩm thạch Wagyu A5 vân mỡ BMS 11 mềm tan như bơ, nấm Morels nhồi và sốt tỏi đen cô đặc 36 giờ.",
      descEn: "Melt-in-the-mouth A5 Miyazaki Wagyu (BMS 11) served with stuffed Morel mushrooms and a 36-hour aged black garlic jus.",
      pairingVi: "Château Margaux Premier Grand Cru Classé 2012",
      pairingEn: "Château Margaux Premier Grand Cru Classé 2012",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop",
      tags: ["Chef Signature", "Beef", "Gluten-Free"],
      calories: "450 kcal",
      techniqueVi: "Hun khói gỗ sồi Pháp & áp chảo nhiệt đối lưu",
      techniqueEn: "French oak cold-smoking & precision pan-roasting",
    },
    {
      courseNumber: "Course 6",
      courseType: "Le Pré-Dessert",
      nameVi: "Kem Tuyết Bưởi Da Xanh & Bọt Rượu Gin Sông Cái",
      nameEn: "Da Xanh Pomelo Granité with Song Cai Botanical Gin Foam",
      descVi: "Lớp granité bưởi mọng nước thanh mát kết hợp bọt hoa hồi, hạt thì là và thảo mộc núi rừng Việt Nam.",
      descEn: "Refreshing ruby pomelo granité elevated with Vietnamese botanical gin foam and crushed pink peppercorns.",
      pairingVi: "Cocktail Tinh Dầu Bưởi & Gin Thủ Công",
      pairingEn: "Artisanal Citrus Infused Gin Elixir",
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1000&auto=format&fit=crop",
      tags: ["Vegetarian", "Gluten-Free"],
      calories: "95 kcal",
      techniqueVi: "Bào đá tinh thể tự nhiên & nhũ hóa khí gas N2O",
      techniqueEn: "Micro-crystal shave & culinary N2O botanical foam",
    },
    {
      courseNumber: "Course 7",
      courseType: "Le Grand Dessert",
      nameVi: "Tuyệt Tác Sô-cô-la Valrhona Guanaja 70% & Cà Phê Cầu Đất",
      nameEn: "Valrhona Guanaja 70% Chocolate Symphony & Cau Dat Arabica",
      descVi: "Cầu sô-cô-la tan chảy khi rưới sốt caramel muối hạt, kem hạt dẻ nướng và bánh sponge hạt phỉ giòn.",
      descEn: "Molten grand cru chocolate sphere revealing roasted hazelnut gelato under warm fleur de sel caramel pour.",
      pairingVi: "Taylor's 20 Year Old Tawny Port",
      pairingEn: "Taylor's 20 Year Old Tawny Port",
      image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1000&auto=format&fit=crop",
      tags: ["Chef Signature", "Vegetarian"],
      calories: "380 kcal",
      techniqueVi: "Tạo hình cầu sô-cô-la thủ công nhiệt độ chuẩn 31°C",
      techniqueEn: "Precision chocolate tempering & artisanal sphere casting",
    }
  ],

  alacarte: [
    {
      id: "alc-1",
      category: "starters",
      nameVi: "Salad Tôm Hùm Nha Trang & Trái Bơ Sáp Đắk Lắk",
      nameEn: "Nha Trang Poached Lobster Salad with Dak Lak Avocado",
      descVi: "Tôm hùm bông hấp nhẹ với lá chanh chúc, bơ sáp béo ngậy, sốt chanh leo và hạt mù tạt ngâm giấm táo.",
      descEn: "Poached sweet spiny lobster with creamy mountain avocado, passion fruit coulis, and pickled mustard seeds.",
      price: "$48",
      image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Sancerre Domaine Vacheron 2021",
      pairingEn: "Sancerre Domaine Vacheron 2021",
      tags: ["Seafood", "Gluten-Free"],
      calories: "220 kcal"
    },
    {
      id: "alc-2",
      category: "starters",
      nameVi: "Súp Nấm Truffle Đen & Bánh Phồng Bơ Pháp Truffle",
      nameEn: "Velvety Black Truffle Soup with Puff Pastry Dome",
      descVi: "Súp kem nấm porcini sánh mịn, phủ lớp nấm truffle đen Perigord và nắp bánh pastry nướng giòn phồng thơm lừng.",
      descEn: "Rich porcini velvety soup crowned with freshly shaved Perigord black truffle and a buttery puff pastry dome.",
      price: "$36",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Meursault Domaine des Comtes Lafon 2018",
      pairingEn: "Meursault Domaine des Comtes Lafon 2018",
      tags: ["Chef Signature", "Vegetarian"],
      calories: "310 kcal"
    },
    {
      id: "alc-3",
      category: "starters",
      nameVi: "Tartare Bò Black Angus & Trứng Cút Lòng Đào Truffle",
      nameEn: "Black Angus Beef Tartare with Truffled Quail Yolk",
      descVi: "Thịt thăn bò tươi cắt hạt lựu nêm sốt capers, mù tạt Dijon, trứng cút lòng đào và bánh mì lúa mạch nướng giòn.",
      descEn: "Hand-cut premium beef tenderloin seasoned with capers, shallots, Dijon, topped with warm truffled quail egg yolk.",
      price: "$42",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Pinot Noir Bourgogne Domaine Faiveley 2020",
      pairingEn: "Pinot Noir Bourgogne Domaine Faiveley 2020",
      tags: ["Beef"],
      calories: "280 kcal"
    },
    {
      id: "alc-4",
      category: "mains",
      nameVi: "Ức Vịt Pháp Áp Chảo & Sốt Cam Gừng Mật Ong Rừng",
      nameEn: "Pan-Roasted French Duck Breast with Wild Orange Gastrique",
      descVi: "Ức vịt Magret da giòn rụm, thịt hồng mọng nước, ăn kèm củ hồi đút lò và hạt sen Huế hầm bơ hạt phỉ.",
      descEn: "Crisp skin French Magret duck breast served medium rare with roasted baby fennel and butter-braised Hue lotus seeds.",
      price: "$65",
      image: "https://images.unsplash.com/photo-1514944298350-01933939634e?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Gevrey-Chambertin Domaine Armand Rousseau 2017",
      pairingEn: "Gevrey-Chambertin Domaine Armand Rousseau 2017",
      tags: ["Chef Signature", "Gluten-Free"],
      calories: "490 kcal"
    },
    {
      id: "alc-5",
      category: "mains",
      nameVi: "Bồ Câu Pháp Hầm Rượu Vang Đỏ & Nấm Morel",
      nameEn: "Slow-Braised French Squab with Morel Ragout",
      descVi: "Thịt chim bồ câu mềm mượt nướng bơ tỏi tây, dùng kèm ragout nấm rừng Morel và khoai tây nghiền truffle.",
      descEn: "Tender pigeon roasted with shallot thyme butter, accompanied by wild Morel fricassee and silk truffle purée.",
      price: "$72",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Châteauneuf-du-Pape Château de Beaucastel 2016",
      pairingEn: "Châteauneuf-du-Pape Château de Beaucastel 2016",
      tags: ["Chef Signature"],
      calories: "520 kcal"
    },
    {
      id: "alc-6",
      category: "seafoodGrill",
      nameVi: "Thăn Bò Wagyu Úc Tomahawk Nướng Than Hồng (1.2kg)",
      nameEn: "Australian Wagyu MB9 Tomahawk Ribeye (1.2kg)",
      descVi: "Dành cho 2 - 3 khách. Nướng trên than củi nhãn, phục vụ kèm 4 loại sốt độc quyền, muối hồng Himalaya và tỏi nướng.",
      descEn: "Serves 2-3 guests. Wood-fire grilled to perfection, accompanied by 4 house sauces and roasted confit garlic.",
      price: "$195",
      image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Barolo DOCG Pio Cesare 2017",
      pairingEn: "Barolo DOCG Pio Cesare 2017",
      tags: ["Beef", "Chef Signature", "Gluten-Free"],
      calories: "980 kcal"
    },
    {
      id: "alc-7",
      category: "seafoodGrill",
      nameVi: "Cua Hoàng Đế Alaska Nướng Bơ Tỏi Đen & Chanh Vàng",
      nameEn: "Alaska King Crab Leg Grilled in Black Garlic Herb Butter",
      descVi: "Chân cua hoàng đế thịt dày ngọt tự nhiên, phết bơ tỏi đen thảo mộc và đốt rượu Cognac tại bàn.",
      descEn: "Succulent giant king crab leg basted with cultured garlic butter, flambéed tableside with fine Cognac.",
      price: "$135",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Corton-Charlemagne Grand Cru Louis Latour 2018",
      pairingEn: "Corton-Charlemagne Grand Cru Louis Latour 2018",
      tags: ["Seafood", "Gluten-Free"],
      calories: "410 kcal"
    },
    {
      id: "alc-8",
      category: "desserts",
      nameVi: "Bánh Soufflé Hạt Vani Madagascar & Kem Mascarpone",
      nameEn: "Madagascar Bourbon Vanilla Bean Soufflé",
      descVi: "Bánh phồng nóng hổi mềm mượt tan trong miệng, ăn kèm sốt kem anglaise thơm lừng và kem vani nguyên chất.",
      descEn: "Airy warm soufflé infused with real bourbon vanilla pods, paired with chilled mascarpone quenelle.",
      price: "$28",
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Château Suduiraut Sauternes 2015",
      pairingEn: "Château Suduiraut Sauternes 2015",
      tags: ["Vegetarian"],
      calories: "340 kcal"
    },
    {
      id: "alc-9",
      category: "desserts",
      nameVi: "Mille-Feuille Dâu Tây Đà Lạt & Kem Hạt Dẻ Cười",
      nameEn: "Crisp Mille-Feuille with Da Lat Strawberries & Pistachio",
      descVi: "Ba tầng bột ngàn lớp giòn tan xen kẽ kem béo pistachio mịn màng và dâu tây hữu cơ chín mọng.",
      descEn: "Golden caramelized puff pastry layered with Bronte pistachio diplomat cream and fragrant mountain strawberries.",
      price: "$26",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
      pairingVi: "Moscato d'Asti DOCG Vietti 2022",
      pairingEn: "Moscato d'Asti DOCG Vietti 2022",
      tags: ["Vegetarian"],
      calories: "310 kcal"
    }
  ],

  wines: [
    {
      id: "w-1",
      category: "champagne",
      name: "Dom Pérignon Vintage Champagne 2015",
      region: "Épernay, Champagne, France",
      notesVi: "Hương hoa trắng thanh tao, quả hạch nướng, đào chín và hậu vị khoáng chất kéo dài bất tận.",
      notesEn: "Aromas of white blossoms, toasted brioche, white peach, with a long, mineral-driven finish.",
      bottlePrice: "$450",
      glassPrice: "$85",
      rating: "97/100 Robert Parker",
      badge: "Prestige Grand Cru",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "w-2",
      category: "champagne",
      name: "Krug Grande Cuvée 170th Edition",
      region: "Reims, Champagne, France",
      notesVi: "Bản giao hưởng của hơn 120 dòng rượu vang tuyển chọn qua 10 niên vụ khác nhau. Phức hợp và vĩ đại.",
      notesEn: "A symphony of 120+ reserve wines from 10 different vintages. Ultra-complex, nutty, and generous.",
      bottlePrice: "$520",
      glassPrice: "$95",
      rating: "98/100 Wine Spectator",
      badge: "Iconic Champagne",
      image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "w-3",
      category: "white",
      name: "Puligny-Montrachet Premier Cru 'Les Pucelles' 2019",
      region: "Côte de Beaune, Burgundy, France",
      notesVi: "Chardonnay thượng hạng nước Pháp. Hương bơ hạt phỉ, lê trắng, hoa keo và độ khoáng chất sắc nét tuyệt mỹ.",
      notesEn: "Sublime Burgundy Chardonnay. Notes of hazelnut butter, crisp Bosc pear, acacia, and razor-sharp salinity.",
      bottlePrice: "$380",
      glassPrice: "$70",
      rating: "96/100 James Suckling",
      badge: "Sommelier Star",
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "w-4",
      category: "red",
      name: "Château Margaux Premier Grand Cru Classé 2012",
      region: "Margaux, Bordeaux, France",
      notesVi: "Tuyệt phẩm vang đỏ thế giới. Mùi hoa violet tím, quả lý chua đen, gỗ tuyết tùng và tannin mượt như nhung lụa.",
      notesEn: "Monumental Bordeaux red. Violet florals, cassis, cedarwood, wrapped in cashmere-smooth tannins.",
      bottlePrice: "$1,250",
      glassPrice: "Chỉ bán theo chai",
      rating: "99/100 Decanter",
      badge: "First Growth 1855",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "w-5",
      category: "red",
      name: "Opus One Napa Valley 2018",
      region: "Oakville, Napa Valley, USA",
      notesVi: "Giao thoa giữa phong cách Bordeaux cổ điển và quả ngọt vùng thung lũng Napa. Quyến rũ và mạnh mẽ.",
      notesEn: "Lush blackberry, dark chocolate, tobacco, mocha with harmonious structural finesse.",
      bottlePrice: "$780",
      glassPrice: "$140",
      rating: "98/100 Robert Parker",
      badge: "Napa Valley Icon",
      image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "w-6",
      category: "cocktails",
      name: "DTN Heritage Golden Smoked Old Fashioned",
      region: "Chữ ký Bếp trưởng Bar LA MAISON",
      notesVi: "Bourbon 12 năm ủ thùng gỗ sồi, mật ong hoa rừng Tây Bắc, đắng thảo mộc và hun khói quế thanh trực tiếp tại ly.",
      notesEn: "12-Year Small Batch Bourbon, highland wild honey, aromatic bitters, tableside smoked with cinnamon wood.",
      bottlePrice: "$32 / Ly",
      glassPrice: "$32",
      rating: "Cocktail of the Year",
      badge: "Signature Mixology",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
    }
  ]
};

const MenuPreview = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active Tab & Modal initialization from URL query params
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'degustation');
  const [isReservationOpen, setIsReservationOpen] = useState(() => searchParams.get('reserve') === 'true');
  const [dietaryFilter, setDietaryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Modals state
  const [selectedDish, setSelectedDish] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  // Reservation form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    seating: 'main',
    specialRequest: '',
    menuPreference: 'degustation'
  });

  // Form & Modal handlers declared first
  const resetReservation = () => {
    setIsReservationOpen(false);
    setReservationSuccess(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: '2',
      seating: 'main',
      specialRequest: '',
      menuPreference: 'degustation'
    });
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const randomCode = 'DTN-DINE-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(randomCode);
    setReservationSuccess(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedDish(null);
        setIsPdfModalOpen(false);
        resetReservation();
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(selectedDish || isReservationOpen || isPdfModalOpen);
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDish, isReservationOpen, isPdfModalOpen]);



  // Filter logic for À La Carte
  const filteredAlacarte = MENU_DATA.alacarte.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDietary = dietaryFilter === 'ALL' || item.tags.some(tag => {
      if (dietaryFilter === 'SIGNATURE') return tag === "Chef Signature";
      if (dietaryFilter === 'VEGETARIAN') return tag === "Vegetarian";
      if (dietaryFilter === 'GLUTEN_FREE') return tag === "Gluten-Free";
      if (dietaryFilter === 'SEAFOOD') return tag === "Seafood";
      if (dietaryFilter === 'BEEF') return tag === "Beef";
      return true;
    });

    return matchesSearch && matchesDietary;
  });

  // Filter logic for Degustation
  const filteredDegustation = MENU_DATA.degustationCourses.filter(course => {
    const matchesSearch = searchQuery === '' ||
      course.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDietary = dietaryFilter === 'ALL' || course.tags.some(tag => {
      if (dietaryFilter === 'SIGNATURE') return tag === "Chef Signature";
      if (dietaryFilter === 'VEGETARIAN') return tag === "Vegetarian";
      if (dietaryFilter === 'GLUTEN_FREE') return tag === "Gluten-Free";
      if (dietaryFilter === 'SEAFOOD') return tag === "Seafood";
      if (dietaryFilter === 'BEEF') return tag === "Beef";
      return true;
    });

    return matchesSearch && matchesDietary;
  });

  // Filter logic for Wine
  const filteredWines = MENU_DATA.wines.filter(wine => {
    return searchQuery === '' ||
      wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wine.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wine.notesVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wine.notesEn.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#11100c] text-[#f8f5f0] font-body selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Header / Navbar */}
      <Navbar scrolled={scrolled} hideNavItems={true} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-navy-deep via-[#1a1710] to-[#11100c]">
        {/* Background Ambient Lights */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-20 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Breadcrumb back */}
          <div className="inline-flex items-center gap-2 mb-6 text-xs tracking-widest uppercase text-primary/80 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <button onClick={() => navigate('/')} className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} />
              <span>{t('heritage.backHome') || 'Trang Chủ'}</span>
            </button>
            <span>/</span>
            <span className="text-white font-semibold">{t('menuPage.badge')}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            {t('menuPage.heroTitle')}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-10">
            {t('menuPage.heroSubtitle')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsReservationOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-navy-deep font-bold text-sm tracking-wider uppercase hover:bg-white hover:scale-105 transition-all shadow-lg shadow-primary/25 cursor-pointer"
            >
              <Calendar size={18} />
              <span>{t('menuPage.reserveBtn')}</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-primary/40 bg-white/5 hover:bg-primary/15 text-white font-semibold text-sm tracking-wider uppercase hover:border-primary transition-all backdrop-blur-sm cursor-pointer"
            >
              <FileText size={18} className="text-primary" />
              <span>{t('menuPage.downloadMenuBtn')}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-center">
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">3-Star</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Michelin Standards</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">450+</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Grand Cru Cellar</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">100%</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Organic Terroir</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">7 Courses</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Seasonal Odyssey</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Interactive Menu System */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs & Filter Control Bar */}
        <div className="sticky top-20 z-40 bg-[#11100c]/95 backdrop-blur-xl py-4 mb-12 border-b border-primary/20 shadow-2xl">
          <div className="max-w-6xl mx-auto space-y-4">

            {/* 1. Main Category Tabs - Smooth Mobile Scrollable */}
            <div className="w-full max-w-4xl mx-auto px-1 sm:px-2">
              <div className="relative w-full">
                {/* Mobile scroll hints */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#11100c] to-transparent z-10 sm:hidden"></div>
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#11100c] to-transparent z-10 sm:hidden"></div>

                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 sm:px-2 sm:justify-center [touch-action:pan-x] [-webkit-overflow-scrolling:touch]">
                  {[
                    { key: 'degustation', label: t('menuPage.tabs.degustation'), icon: Sparkles },
                    { key: 'alacarte', label: t('menuPage.tabs.alacarte'), icon: Utensils },
                    { key: 'wine', label: t('menuPage.tabs.wine'), icon: Wine },
                    { key: 'all', label: t('menuPage.tabs.all'), icon: Eye }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer select-none ${isActive
                            ? 'bg-primary text-navy-deep shadow-lg shadow-primary/35 font-extrabold ring-2 ring-primary/50 scale-[1.02]'
                            : 'bg-[#1a1710] text-slate-300 hover:text-white hover:bg-[#252015] border border-primary/20 backdrop-blur-md'
                          }`}
                      >
                        <Icon size={16} className={`shrink-0 ${isActive ? 'text-navy-deep' : 'text-primary'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Secondary Toolbar: Search + Dietary Filters */}
            <div className="bg-[#18150f]/90 border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">

              {/* Search Box */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  placeholder={t('menuPage.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Dietary Tag Pills */}
              <div className="relative w-full lg:w-auto overflow-hidden">
                <div className="w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth flex items-center justify-start lg:justify-end gap-1.5 sm:gap-2 py-1 px-1 [touch-action:pan-x] [-webkit-overflow-scrolling:touch]">
                  {[
                    { id: 'ALL', label: t('menuPage.filterAll') },
                    { id: 'SIGNATURE', label: t('menuPage.filterSignature'), icon: Award },
                    { id: 'SEAFOOD', label: t('menuPage.filterSeafood') },
                    { id: 'BEEF', label: t('menuPage.filterBeef') },
                    { id: 'VEGETARIAN', label: t('menuPage.filterVegetarian'), icon: Leaf },
                    { id: 'GLUTEN_FREE', label: t('menuPage.filterGlutenFree') }
                  ].map(filter => {
                    const isSelected = dietaryFilter === filter.id;
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setDietaryFilter(filter.id)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${isSelected
                            ? 'bg-primary/20 text-primary border border-primary font-bold shadow-sm shadow-primary/20 ring-1 ring-primary/40'
                            : 'bg-black/40 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                          }`}
                      >
                        {Icon && <Icon size={13} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />}
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}

                  {(dietaryFilter !== 'ALL' || searchQuery !== '') && (
                    <button
                      onClick={() => {
                        setDietaryFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="shrink-0 px-2.5 py-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline whitespace-nowrap cursor-pointer ml-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* --- TAB 1: 7-COURSE DEGUSTATION JOURNEY --- */}
        {(activeTab === 'degustation' || activeTab === 'all') && (
          <section className="mb-24">
            <div className="bg-gradient-to-r from-[#241f15] via-[#2d271a] to-[#241f15] rounded-3xl p-6 sm:p-10 md:p-12 border border-primary/30 shadow-2xl relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-primary/20">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
                    <Sparkles size={14} />
                    <span>{t('menuPage.degustation.tag')}</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {t('menuPage.degustation.title')}
                  </h2>
                  <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                    {t('menuPage.degustation.desc')}
                  </p>
                </div>

                <div className="bg-black/40 border border-primary/30 p-6 rounded-2xl shrink-0 w-full lg:w-auto text-center lg:text-right backdrop-blur-sm">
                  <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">Tasting Menu Price</span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-primary block">{t('menuPage.degustation.price')}</span>
                  <span className="text-xs text-amber-200/80 block mt-2">{t('menuPage.degustation.pairingPrice')}</span>
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, menuPreference: 'degustation' }));
                      setIsReservationOpen(true);
                    }}
                    className="mt-4 w-full px-6 py-2.5 bg-primary hover:bg-white text-navy-deep font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {t('dining.reserveExp')}
                  </button>
                </div>
              </div>

              {/* 7-Course Timeline Cards */}
              <div className="mt-12 space-y-8">
                {filteredDegustation.map((course, idx) => (
                  <div
                    key={idx}
                    className="group bg-black/40 hover:bg-black/60 border border-white/10 hover:border-primary/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                  >
                    {/* Course Image */}
                    <div className="lg:col-span-4 h-56 lg:h-48 rounded-xl overflow-hidden relative">
                      <img
                        src={course.image}
                        alt={language === 'vi' ? course.nameVi : course.nameEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-navy-deep/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/30">
                        {course.courseNumber}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-medium text-slate-300">
                        {course.courseType}
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {course.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          <span className="text-slate-500 text-xs flex items-center gap-1 ml-auto">
                            <Flame size={12} className="text-amber-500" />
                            {course.calories}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors">
                          {language === 'vi' ? course.nameVi : course.nameEn}
                        </h3>
                        <span className="italic text-xs text-amber-200/60 block mt-0.5 font-serif">{course.nameFr}</span>

                        <p className="text-slate-300 text-sm font-light mt-3 leading-relaxed">
                          {language === 'vi' ? course.descVi : course.descEn}
                        </p>
                      </div>

                      {/* Wine Pairing Footer */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 text-xs">
                          <Wine size={16} className="text-primary shrink-0" />
                          <span className="text-slate-400 font-medium">{t('menuPage.dishCard.winePairing')}</span>
                          <span className="text-amber-300 font-semibold italic truncate max-w-xs sm:max-w-sm">
                            {language === 'vi' ? course.pairingVi : course.pairingEn}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedDish({
                            name: language === 'vi' ? course.nameVi : course.nameEn,
                            subtitle: course.nameFr,
                            desc: language === 'vi' ? course.descVi : course.descEn,
                            pairing: language === 'vi' ? course.pairingVi : course.pairingEn,
                            technique: language === 'vi' ? course.techniqueVi : course.techniqueEn,
                            image: course.image,
                            calories: course.calories,
                            tags: course.tags,
                            type: course.courseType
                          })}
                          className="text-xs text-primary hover:text-white font-bold inline-flex items-center gap-1 hover:underline cursor-pointer self-end sm:self-center shrink-0"
                        >
                          <span>{t('menuPage.dishCard.detailsBtn')}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- TAB 2: À LA CARTE SELECTION --- */}
        {(activeTab === 'alacarte' || activeTab === 'all') && (
          <section className="mb-24">
            <div className="text-center mb-12">
              <span className="text-primary font-display italic text-lg tracking-wider block mb-1">LA CARTE DU CHEF</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {t('menuPage.tabs.alacarte')}
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-primary rounded-full"></div>
            </div>

            {/* Grid of A La Carte Dishes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlacarte.map((dish) => (
                <div
                  key={dish.id}
                  className="group bg-[#1c1912] hover:bg-[#252016] border border-white/10 hover:border-primary/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1.5"
                >
                  <div>
                    {/* Dish Image */}
                    <div className="h-56 relative overflow-hidden">
                      <img
                        src={dish.image}
                        alt={language === 'vi' ? dish.nameVi : dish.nameEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-3 bg-primary text-navy-deep px-3 py-1 rounded-full font-serif font-bold text-base shadow-md">
                        {dish.price}
                      </div>

                      {/* Tag badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {dish.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {language === 'vi' ? dish.nameVi : dish.nameEn}
                      </h3>

                      <p className="text-slate-300 text-xs sm:text-sm font-light mt-3 leading-relaxed line-clamp-3">
                        {language === 'vi' ? dish.descVi : dish.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom / Wine note & CTA */}
                  <div className="p-6 pt-0 border-t border-white/5 mt-4">
                    <div className="flex items-center gap-2 text-xs text-amber-200/80 mb-4 bg-black/30 p-2.5 rounded-lg">
                      <Wine size={14} className="text-primary shrink-0" />
                      <span className="truncate italic">
                        {language === 'vi' ? dish.pairingVi : dish.pairingEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedDish({
                          name: language === 'vi' ? dish.nameVi : dish.nameEn,
                          subtitle: dish.price,
                          desc: language === 'vi' ? dish.descVi : dish.descEn,
                          pairing: language === 'vi' ? dish.pairingVi : dish.pairingEn,
                          technique: t('menuPage.modal.techniqueTitle'),
                          image: dish.image,
                          calories: dish.calories,
                          tags: dish.tags,
                          type: "À La Carte"
                        })}
                        className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Info size={14} />
                        <span>{t('menuPage.dishCard.detailsBtn')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, specialRequest: `Quan tâm món: ${dish.nameVi} (${dish.price})` }));
                          setIsReservationOpen(true);
                        }}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-navy-deep font-bold text-xs uppercase tracking-wider rounded-lg transition-all border border-primary/30 cursor-pointer"
                      >
                        {t('menuPage.modal.orderBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- TAB 3: WINE CELLAR & SOMMELIER COLLECTION --- */}
        {(activeTab === 'wine' || activeTab === 'all') && (
          <section className="mb-24">
            <div className="text-center mb-12">
              <span className="text-primary font-display italic text-lg tracking-wider block mb-1">LA CAVE DU SOMMELIER</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {t('menuPage.tabs.wine')}
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
                {t('menuPage.sommelierNote')}
              </p>
              <div className="mx-auto mt-4 h-1 w-20 bg-primary rounded-full"></div>
            </div>

            {/* Wine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWines.map((wine) => (
                <div
                  key={wine.id}
                  className="group bg-[#1c1912] hover:bg-[#252016] border border-white/10 hover:border-primary/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>

                  <div>
                    {/* Header with region & rating */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="bg-primary/10 text-primary border border-primary/30 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                        {wine.badge}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold bg-black/50 px-2 py-0.5 rounded border border-white/10">
                        ★ {wine.rating}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {wine.name}
                    </h3>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} className="text-primary" />
                      {wine.region}
                    </span>

                    <p className="text-slate-300 text-xs sm:text-sm font-light mt-4 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
                      {language === 'vi' ? wine.notesVi : wine.notesEn}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Bottle / Glass</span>
                      <span className="font-serif text-lg font-bold text-primary">{wine.bottlePrice}</span>
                      <span className="text-xs text-slate-400 ml-1">({wine.glassPrice})</span>
                    </div>

                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, specialRequest: `Yêu cầu rượu: ${wine.name}` }));
                        setIsReservationOpen(true);
                      }}
                      className="px-4 py-2 bg-primary hover:bg-white text-navy-deep font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
                    >
                      {t('dining.reserveExp')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executive Chef & Sommelier Story Spotlight */}
        <section className="my-20 bg-gradient-to-br from-[#1a1710] to-[#252016] rounded-3xl p-8 sm:p-12 border border-primary/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="h-96 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop"
                  alt="Executive Chef"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-navy-deep/95 border border-primary/40 p-4 rounded-xl shadow-xl backdrop-blur-md max-w-xs">
                <span className="text-xs text-primary font-bold uppercase tracking-wider block">Chef de Cuisine</span>
                <span className="font-serif text-base font-bold text-white block">Chef Laurent V. & Chef Minh</span>
                <span className="text-[11px] text-slate-400">Former Michelin-starred Gastronomy Lead</span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Sparkles size={14} />
                <span>Culinary Philosophy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                {language === 'vi'
                  ? "Sứ Mệnh Tôn Vinh Tinh Hoa Nguyên Liệu"
                  : "A Symphony of Terroir & Classical Artistry"}
              </h2>

              <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed">
                {language === 'vi'
                  ? "Tại LA MAISON DTN, chúng tôi tin rằng ẩm thực đỉnh cao không chỉ là sự xa hoa trên đĩa ăn, mà là một câu chuyện cảm xúc kết nối nguồn cội thiên nhiên với kỹ nghệ chế biến điêu luyện. Mỗi nguyên liệu từ sò điệp Hokkaido, nấm truffle Perigord cho đến bưởi da xanh và tỏi đen Lý Sơn đều được lựa chọn ở độ tươi ngon hoàn hảo nhất."
                  : "At LA MAISON DTN, haute cuisine is not merely an exquisite luxury on the plate; it is an emotional voyage intertwining nature's purest terroir with uncompromising French culinary precision. Every element, from Hokkaido scallops and Perigord truffles to local highland citrus, is harvested at its sensory zenith."}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-xs font-medium text-slate-200">100% Farm-To-Table Certified</span>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-xs font-medium text-slate-200">Daily Fresh Fish Air-Flown</span>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-xs font-medium text-slate-200">Temperature Controlled Cellar</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- MODAL 1: DISH DETAILS MODAL --- */}
      {selectedDish && (
        <div
          onClick={() => setSelectedDish(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1b13] border border-primary/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto max-h-[85vh] flex flex-col"
          >
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-primary hover:text-navy-deep flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X size={16} />
            </button>

            {/* Modal Image */}
            <div className="h-44 sm:h-48 relative shrink-0">
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b13] via-[#1e1b13]/40 to-transparent"></div>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold block">{selectedDish.type}</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">{selectedDish.name}</h3>
                  {selectedDish.subtitle && (
                    <span className="italic text-xs text-amber-200/70 block mt-0.5">{selectedDish.subtitle}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
              <div>
                <h4 className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1.5">Description</h4>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">{selectedDish.desc}</p>
              </div>

              {selectedDish.technique && (
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5">
                  <h4 className="text-[11px] uppercase tracking-widest text-primary font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>{t('menuPage.modal.techniqueTitle')}</span>
                  </h4>
                  <p className="text-slate-300 text-xs">{selectedDish.technique}</p>
                </div>
              )}

              {selectedDish.pairing && (
                <div className="bg-primary/10 p-3.5 rounded-xl border border-primary/30 flex items-start gap-2.5">
                  <Wine size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[11px] uppercase tracking-widest text-primary font-bold">{t('menuPage.modal.pairingTitle')}</h4>
                    <p className="text-amber-200 text-xs italic font-medium mt-0.5">{selectedDish.pairing}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedDish.tags?.map((t, idx) => (
                  <span key={idx} className="bg-white/10 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-full border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-[#18150f] border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                onClick={() => setSelectedDish(null)}
                className="px-5 py-2 rounded-xl border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {t('menuPage.modal.closeBtn')}
              </button>

              <button
                onClick={() => {
                  const dishName = selectedDish.name;
                  setSelectedDish(null);
                  setFormData(prev => ({ ...prev, specialRequest: `Quan tâm món: ${dishName}` }));
                  setIsReservationOpen(true);
                }}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-white text-navy-deep font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {t('menuPage.modal.orderBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TABLE RESERVATION MODAL --- */}
      {isReservationOpen && (
        <div
          onClick={resetReservation}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1b13] border border-primary/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto max-h-[88vh] flex flex-col"
          >
            <button
              onClick={resetReservation}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-primary hover:text-navy-deep flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X size={16} />
            </button>

            {!reservationSuccess ? (
              <div className="p-5 sm:p-7 overflow-y-auto no-scrollbar">
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-1.5">
                    <Calendar size={13} />
                    <span>{t('menuPage.reservation.badge')}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {t('menuPage.reservation.title')}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    {t('menuPage.reservation.subtitle')}
                  </p>
                </div>

                <form onSubmit={handleReservationSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      {t('menuPage.reservation.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        {t('menuPage.reservation.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0912 345 678"
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        {t('menuPage.reservation.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="guest@example.com"
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        {t('menuPage.reservation.date')} *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-2.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        {t('menuPage.reservation.time')} *
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-2.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      >
                        <option value="11:30">11:30 (Trưa)</option>
                        <option value="12:30">12:30 (Trưa)</option>
                        <option value="18:00">18:00 (Sunset Tasting)</option>
                        <option value="19:00">19:00 (Bữa tối nến)</option>
                        <option value="20:00">20:00 (Bữa tối nến)</option>
                        <option value="21:00">21:00 (Late Night Cellar)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        {t('menuPage.reservation.guests')} *
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-2.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, '10+ (VIP Group)'].map((num) => (
                          <option key={num} value={num}>{num} {language === 'vi' ? 'Khách' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      {t('menuPage.reservation.seating')}
                    </label>
                    <select
                      value={formData.seating}
                      onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="main">{t('menuPage.reservation.seatingMain')}</option>
                      <option value="cellar">{t('menuPage.reservation.seatingCellar')}</option>
                      <option value="veranda">{t('menuPage.reservation.seatingVeranda')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      {t('menuPage.reservation.specialRequest')}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                      placeholder="Dị ứng hải sản, chuẩn bị bánh sinh nhật, hoa tươi..."
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-3 bg-primary hover:bg-white text-navy-deep font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    {t('menuPage.reservation.submitBtn')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center space-y-5">
                <div className="w-14 h-14 bg-primary/20 border-2 border-primary text-primary rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check size={28} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-1.5">
                    {t('menuPage.reservation.successTitle')}
                  </h3>
                  <p className="text-slate-300 text-xs max-w-md mx-auto leading-relaxed">
                    {t('menuPage.reservation.successDesc')}
                  </p>
                </div>

                <div className="bg-black/50 p-3.5 rounded-2xl border border-primary/30 max-w-xs mx-auto">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block">{t('menuPage.reservation.bookingCode')}</span>
                  <span className="font-mono text-lg font-bold text-primary tracking-wider">{bookingCode}</span>
                </div>

                <button
                  onClick={resetReservation}
                  className="px-6 py-2.5 bg-primary text-navy-deep font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all cursor-pointer"
                >
                  {t('menuPage.reservation.closeSuccess')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 3: PDF PREVIEW MODAL --- */}
      {isPdfModalOpen && (
        <div
          onClick={() => setIsPdfModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e1b13] border border-primary/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[85vh] flex flex-col"
          >
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-primary hover:text-navy-deep flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X size={16} />
            </button>

            <div className="p-5 sm:p-7 text-center border-b border-white/10 shrink-0">
              <span className="text-primary font-display italic text-sm">LA MAISON GASTRONOMY</span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">{t('menuPage.pdfPreview.title')}</h3>
              <p className="text-slate-400 text-xs mt-0.5">{t('menuPage.pdfPreview.desc')}</p>
            </div>

            {/* Stylized Leather-bound Menu Book Preview */}
            <div className="p-6 bg-[#14120e] overflow-y-auto no-scrollbar flex-1 space-y-4">
              <div className="border border-primary/30 p-6 rounded-2xl bg-[#1c1912] shadow-inner text-center font-serif">
                <span className="text-primary tracking-widest text-[10px] uppercase block mb-1.5">AUTUMN - WINTER TASTING ODYSSEY</span>
                <h4 className="text-xl font-bold text-amber-200 mb-5">7-Course Seasonal Tasting Menu</h4>

                <div className="space-y-3.5 text-xs font-light text-slate-300 max-w-lg mx-auto">
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 1: Royal Caviar & Sea Urchin Tartlet</span>
                    <span className="italic text-amber-200/70">Dom Pérignon 2015</span>
                  </div>
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 2: Hokkaido Scallop Carpaccio</span>
                    <span className="italic text-amber-200/70">Chablis Premier Cru 2020</span>
                  </div>
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 3: Pan-Seared Rougié Foie Gras</span>
                    <span className="italic text-amber-200/70">Château d'Yquem Sauternes 2011</span>
                  </div>
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 4: Glacier 51 Toothfish & Black Truffle</span>
                    <span className="italic text-amber-200/70">Puligny-Montrachet 2019</span>
                  </div>
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 5: Miyazaki Wagyu A5 Sirloin</span>
                    <span className="italic text-amber-200/70">Château Margaux 2012</span>
                  </div>
                  <div className="border-b border-primary/10 pb-2">
                    <span className="font-bold text-white block">Course 6: Da Xanh Pomelo Granité</span>
                    <span className="italic text-amber-200/70">Song Cai Botanical Gin Foam</span>
                  </div>
                  <div>
                    <span className="font-bold text-white block">Course 7: Valrhona Guanaja 70% Sphere</span>
                    <span className="italic text-amber-200/70">Taylor's 20-Year Tawny Port</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#18150f] border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-white/20 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {t('menuPage.pdfPreview.close')}
              </button>

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert(language === 'vi' ? 'Đang khởi tạo tệp PDF thực đơn chất lượng cao...' : 'Generating high-resolution menu PDF file...');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-white text-navy-deep font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Download size={15} />
                <span>{t('menuPage.pdfPreview.downloadNow')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MenuPreview;
