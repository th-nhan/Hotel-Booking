import { Utensils, Sparkles, Heart } from 'lucide-react';

export const WELLNESS_TREATMENTS = [
  {
    id: 'salt-therapy',
    slug: 'salt-therapy',
    category: 'salt-steam',
    badgeVi: 'Phổ Biến Nhất',
    badgeEn: 'Most Popular',
    tag: 'Respiratory & Detox',
    titleVi: 'Liệu Pháp Muối Hồng Himalaya',
    titleEn: 'Himalayan Pink Salt Inhalation Chamber',
    duration: '60 Phút',
    durationEn: '60 Mins',
    priceVnd: '1.200.000 VNĐ',
    priceUsd: '$180 USD',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    descVi: 'Hít thở sâu trong phòng muối độc quyền được ốp đá muối tự nhiên nguyên khối từ dãy Himalaya, phát tán các ion âm thanh lọc hệ hô hấp, giải tỏa căng thẳng và cải thiện làn da.',
    descEn: 'Breathe deeply in our exclusive Himalayan crystal salt chamber emitting negative ions to detoxify the respiratory tract, relieve anxiety, and revitalize dermal clarity.',
    benefitsVi: [
      'Thanh lọc và tăng cường dung tích hệ hô hấp',
      'Cân bằng ion âm giúp giảm căng thẳng thần kinh',
      'Kháng viêm tự nhiên và hỗ trợ phục hồi làn da',
      'Cải thiện chất lượng giấc ngủ sâu'
    ],
    benefitsEn: [
      'Purifies and expands respiratory capacity',
      'Negative ions restore neurological calm and serenity',
      'Natural anti-inflammatory dermal soothing',
      'Promotes profound restorative sleep'
    ],
    ingredientsVi: 'Đá muối hồng Himalaya tự nhiên, tinh dầu oải hương Pháp hữu cơ.',
    ingredientsEn: 'Pure Himalayan rock salt crystals, French organic lavender essential oil.',
    ritualStepsVi: [
      { step: '01', title: 'Nghi thức tẩy trần & Ngâm chân thảo mộc', desc: 'Ngâm chân bằng nước muối ấm ngâm hoa sen tươi và thảo mộc tự nhiên.' },
      { step: '02', title: 'Tĩnh tọa trị liệu trong phòng muối ion âm', desc: '45 phút thư giãn có hướng dẫn điều hòa hơi thở với âm nhạc thiền định và ánh sáng hổ phách.' },
      { step: '03', title: 'Thưởng trà thảo mộc & Tái cân bằng', desc: 'Thưởng thức trà sen sấy thăng hoa và mật ong hoa bạc hà tại phòng nghỉ dưỡng.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Purification & Herbal Foot Ritual', desc: 'Warm lotus flower and organic botanical foot bath infusion.' },
      { step: '02', title: 'Inhalation Therapy in Salt Sanctuary', desc: '45 minutes guided breathwork in amber negative-ion halo chamber with meditative acoustics.' },
      { step: '03', title: 'Herbal Tea & Final Harmonization', desc: 'Complimentary freeze-dried lotus tea and mint blossom honey in relaxation salon.' }
    ]
  },
  {
    id: 'steam-room',
    slug: 'steam-room',
    category: 'salt-steam',
    badgeVi: 'Thanh Lọc Độc Tố',
    badgeEn: 'Deep Detox',
    tag: 'Hydrotherapy',
    titleVi: 'Phòng Xông Hơi Cẩm Thạch & Thủy Liệu',
    titleEn: 'Italian Marble Steam & Hydrotherapy Circuit',
    duration: '45 Phút',
    durationEn: '45 Mins',
    priceVnd: '850.000 VNĐ',
    priceUsd: '$120 USD',
    image: 'https://hanteco.vn/hinhanh/tintuc/thiet-ke-khu-xong-hoi-spa-chuyen-nghiep-hop-ly-8.jpg',
    descVi: 'Không gian xông hơi ốp đá cẩm thạch Ý Carrara huyền ảo kết hợp tinh dầu tràm gió nguyên chất và thác nước khoáng ấm, giúp giãn cơ bắp, thông thoáng lỗ chân lông và đào thải độc tố.',
    descEn: 'Neoclassical Italian Carrara marble steam haven infused with wild cajeput botanicals and mineral waterfalls to soothe deep muscle soreness and promote cellular detox.',
    benefitsVi: [
      'Giãn cơ bắp sâu và kích thích tuần hoàn máu',
      'Đào thải độc tố qua tuyến mồ hôi và làm sáng da',
      'Giải tỏa nghẽn nghẹt xoang và tăng cường đề kháng',
      'Tạo cảm giác sảng khoái, nhẹ nhõm toàn thân'
    ],
    benefitsEn: [
      'Deeply eases muscle tension and boosts circulation',
      'Sweat-induced detoxification and skin rejuvenation',
      'Clears sinus airways and elevates immune vitality',
      'Leaves the whole body light, limber, and invigorated'
    ],
    ingredientsVi: 'Tinh dầu tràm gió Huế, sả chanh hữu cơ, khoáng chất nóng tự nhiên.',
    ingredientsEn: 'Artisanal cajeput essence, organic lemongrass, natural thermal minerals.',
    ritualStepsVi: [
      { step: '01', title: 'Khởi động mạch nhiệt độ cơ thể', desc: 'Tắm tráng nước khoáng ấm và chuẩn bị cơ thể tiếp nhận nhiệt liệu pháp.' },
      { step: '02', title: 'Xông hơi cẩm thạch thảo mộc', desc: '30 phút xông hơi hơi nước ion kèm xịt khoáng tươi thảo dược.' },
      { step: '03', title: 'Thủy liệu pháp hạ nhiệt & Thư giãn', desc: 'Ngâm bồn sục jacuzzi thảo mộc và thưởng thức nước ép trái cây hữu cơ.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Thermal Warm-up Shower', desc: 'Warm mineral shower preparing body physiology for thermo-therapy.' },
      { step: '02', title: 'Herbal Steam Chamber Immersion', desc: '30 minutes ionic steam enveloped in botanical mists.' },
      { step: '03', title: 'Hydro-Jet Cooldown & Hydration', desc: 'Jacuzzi mineral soak followed by cold-pressed organic wellness juices.' }
    ]
  },
  {
    id: 'royal-awakening',
    slug: 'royal-awakening',
    category: 'royal',
    badgeVi: 'Gói Thượng Lưu Độc Quyền',
    badgeEn: 'Ultra-Luxury Signature',
    tag: 'Full-Day Odyssey',
    titleVi: 'Đánh Thức Năng Lượng Hoàng Gia',
    titleEn: 'The Royal Awakening Full-Day Odyssey',
    duration: '4 Giờ',
    durationEn: '4 Hours',
    priceVnd: '2.500.000 VNĐ',
    priceUsd: '$450 USD',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop',
    descVi: 'Gói trải nghiệm tĩnh dưỡng trọn vẹn đặc trưng kết hợp Liệu pháp muối Himalaya, Phòng xông hơi cẩm thạch, 90 phút mát-xa mô sâu đá nóng núi lửa, chăm sóc da mặt dát vàng lá 24k và bữa trưa thanh nhẹ Michelin.',
    descEn: 'Our definitive signature holistic retreat uniting Himalayan salt therapy, marble steam circuit, 90-minute volcanic hot stone massage, 24k gold leaf facial, and a light Michelin-crafted organic luncheon.',
    benefitsVi: [
      'Tái tạo năng lượng toàn diện cả Thân - Tâm - Trí',
      'Đánh tan các điểm co thắt cơ lâu năm với đá nóng núi lửa',
      'Làn da bừng sáng rạng ngời với tinh chất vàng 24k',
      'Bao gồm bữa trưa hữu cơ dinh dưỡng thiết kế bởi Bếp trưởng'
    ],
    benefitsEn: [
      'Comprehensive total body, mind, and spirit regeneration',
      'Dissolves chronic myofascial knots with volcanic basalt stones',
      'Skin glows with renewed firmness through 24k pure gold leaf',
      'Includes custom organic culinary lunch prepared by Executive Chef'
    ],
    ingredientsVi: 'Vàng lá 24k cao cấp, đá bazan núi lửa tự nhiên, tinh dầu trầm hương hoàng cung.',
    ingredientsEn: '24k cosmetic gold foil, heated volcanic basalt stones, royal frankincense.',
    ritualStepsVi: [
      { step: '01', title: 'Khởi đầu: Thủy liệu & Xông hơi muối khoáng', desc: 'Thanh lọc cơ thể trong phòng xông hơi và phòng muối Himalaya (60 phút).' },
      { step: '02', title: 'Trọng tâm: Mát-xa mô sâu đá nóng & Vàng 24k', desc: '90 phút massage đá bazan kết hợp liệu trình chăm sóc da mặt 24k Gold Radiance.' },
      { step: '03', title: 'Ẩm thực dinh dưỡng & Tĩnh dưỡng VIP', desc: 'Thưởng thức bữa trưa hữu cơ 3 món tại phòng Suite riêng và trà chiều hoàng gia.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Initiation: Steam & Salt Hydro-Detox', desc: 'Complete body purification in salt chamber and marble steam circuit (60 mins).' },
      { step: '02', title: 'Core: Hot Basalt Massage & 24k Gold Facial', desc: '90 mins hot volcanic stone bodywork paired with 24k Gold Radiance facial.' },
      { step: '03', title: 'Culinary Nourishment & Private Suite Care', desc: '3-course organic spa cuisine in private couple suite with royal afternoon tea.' }
    ]
  },
  {
    id: 'gold-radiance',
    slug: 'gold-radiance',
    category: 'facial',
    badgeVi: 'Trẻ Hóa Hoàng Tộc',
    badgeEn: 'Imperial Radiance',
    tag: 'Facial Luxury',
    titleVi: 'Liệu Trình Trẻ Hóa Dát Vàng 24k',
    titleEn: 'Imperial 24k Gold Radiance Facial',
    duration: '90 Phút',
    durationEn: '90 Mins',
    priceVnd: '1.800.000 VNĐ',
    priceUsd: '$220 USD',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop',
    descVi: 'Ứng dụng lá vàng 24k tinh khiết kết hợp serum tế bào thực vật và kỹ thuật ấn huyệt nâng cơ mặt độc quyền, kích thích sản sinh collagen tự nhiên, mang lại diện mạo căng bóng quý phái.',
    descEn: 'Pure cosmetic 24k gold leaf and botanical stem-cell serums merged with bespoke acupressure lifting techniques to stimulate collagen synthesis and bestow an imperial glow.',
    benefitsVi: [
      'Kích thích tái tạo tế bào và tăng độ săn chắc đàn hồi',
      'Làm mờ nếp nhăn và cải thiện sắc tố da sáng mịn',
      'Chống oxy hóa mạnh mẽ và ngăn ngừa lão hóa'
    ],
    benefitsEn: [
      'Activates cellular regeneration and elasticity',
      'Reduces fine lines while evening out skin tone',
      'Potent antioxidant protection against aging factors'
    ],
    ingredientsVi: 'Vàng lá 24k Thụy Sĩ, tinh chất hoa hồng Damask, Collagen thực vật hữu cơ.',
    ingredientsEn: 'Swiss 24k cosmetic gold sheets, Damask rose essence, plant collagen.',
    ritualStepsVi: [
      { step: '01', title: 'Tẩy trang & Tẩy tế bào chết ngọc trai', desc: 'Làm sạch sâu lỗ chân lông bằng bột ngọc trai Phú Quốc và nước hoa hồng hữu cơ.' },
      { step: '02', title: 'Đắp mặt nạ vàng lá 24k & Nâng cơ', desc: 'Phủ vàng lá 24k nguyên chất kết hợp điện di ion lạnh và massage ấn huyệt.' },
      { step: '03', title: 'Khóa ẩm & Thoa dưỡng chất quý tộc', desc: 'Thoa kem dưỡng tế bào gốc và kem chống nắng khoáng chất cao cấp.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Pearl Exfoliation & Deep Cleansing', desc: 'Gentle micro-exfoliation with natural pearl powder and organic rosewater.' },
      { step: '02', title: '24k Gold Foil Mask & Acupressure Lifting', desc: 'Pure 24k gold leaf application coupled with cryo-infusion and lymphatic drainage.' },
      { step: '03', title: 'Lock-in Hydration & Royal Finish', desc: 'Botanical stem-cell cream and high-protection mineral finish.' }
    ]
  },
  {
    id: 'oriental-herbal',
    slug: 'oriental-herbal',
    category: 'herbal',
    badgeVi: 'Y Học Cổ Truyền',
    badgeEn: 'Eastern Heritage',
    tag: 'Herbal Compress',
    titleVi: 'Trị Liệu Thảo Dược Cổ Truyền Đông Y',
    titleEn: 'Oriental Herbal Compress & Deep Tissue Ritual',
    duration: '75 Phút',
    durationEn: '75 Mins',
    priceVnd: '1.100.000 VNĐ',
    priceUsd: '$150 USD',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    descVi: 'Túi chườm nóng 18 vị thảo mộc quý được hấp chín tỏa hương ngào ngạt kết hợp các đường miết bấm huyệt Đông y giải tỏa toàn bộ ứ trệ kinh lạc, xua tan nhức mỏi xương khớp.',
    descEn: 'Warm herbal compresses of 18 sacred Eastern roots steamed to perfection combined with rhythmic meridian acupressure to dissolve stagnation and joint fatigue.',
    benefitsVi: [
      'Lưu thông khí huyết và khai thông kinh lạc toàn thân',
      'Đặc trị đau mỏi cổ vai gáy và cột sống thắt lưng',
      'Hương thơm thảo dược xoa dịu thần kinh tức thì'
    ],
    benefitsEn: [
      'Restores systemic Chi flow and vascular circulation',
      'Relieves cervical spine, shoulder, and lumbar strain',
      'Aromatherapeutic herbs soothe nervous agitation instantly'
    ],
    ingredientsVi: 'Gừng gió, ngải cứu nhung, quế chi, hoa hồi, ngải cứu khô, sả rừng.',
    ingredientsEn: 'Wild ginger, mugwort, cinnamon bark, star anise, forest lemongrass.',
    ritualStepsVi: [
      { step: '01', title: 'Khai thông huyệt đạo lưng & bàn chân', desc: 'Ấn huyệt làm ấm kinh lạc bằng tinh dầu ngải cứu cô đặc.' },
      { step: '02', title: 'Chườm túi thảo mộc nóng 18 vị', desc: 'Lăn chườm thảo mộc dọc sống lưng, vai gáy và vùng bắp chân.' },
      { step: '03', title: 'Massage xoa bóp hồi phục', desc: 'Kéo giãn cơ nhẹ nhàng phong cách hoàng gia và lau khăn ấm thảo dược.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Meridian Acupressure Activation', desc: 'Deep palm pressure and mugwort essential oils warming energy pathways.' },
      { step: '02', title: 'Steamed 18-Herb Compress Application', desc: 'Rhythmic compress glide along the spine, neck, and calves.' },
      { step: '03', title: 'Restorative Gentle Stretch & Cleanse', desc: 'Gentle royal stretching finished with warm herbal towel wraps.' }
    ]
  },
  {
    id: 'vitality-bath',
    slug: 'vitality-bath',
    category: 'herbal',
    badgeVi: 'Thủy Liệu Thư Giãn',
    badgeEn: 'Thermal Vitality',
    tag: 'Private Bathing',
    titleVi: 'Bồn Ngâm Thủy Lực Suối Khoáng & Thảo Mộc',
    titleEn: 'Private Thermal Mineral Bath & Vitality Soak',
    duration: '60 Phút',
    durationEn: '60 Mins',
    priceVnd: '950.000 VNĐ',
    priceUsd: '$130 USD',
    image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1000&q=80',
    descVi: 'Ngâm mình trong bồn ngâm thủy lực bằng gỗ Pơ mu thơm ngát ngập tràn cánh hoa tươi, nước khoáng ấm giàu vi lượng và tinh chất sữa yến mạch giúp làm mềm mịn da và thư giãn tuyệt đỉnh.',
    descEn: 'Soak in private aromatic Hinoki wood vitality jacuzzis infused with fresh blossoms, mineral-rich thermal water, and oat milk essences for velvety skin and utter serenity.',
    benefitsVi: [
      'Làm dịu hệ cơ bắp sau chuyến bay dài hoặc ngày bận rộn',
      'Nuôi dưỡng làn da mềm mượt với tinh chất sữa và hoa sen',
      'Không gian ngâm tắm riêng tư chuẩn 5 sao'
    ],
    benefitsEn: [
      'Alleviates post-flight fatigue and muscle tightness',
      'Nourishes supple skin texture with organic oat milk and lotus',
      'Utmost privacy in dedicated luxury suite'
    ],
    ingredientsVi: 'Cánh hoa sen hồng, sữa yến mạch hữu cơ, muối khoáng biển chết, tinh dầu ngọc lan tây.',
    ingredientsEn: 'Pink lotus petals, organic oat milk, Dead Sea minerals, ylang-ylang oil.',
    ritualStepsVi: [
      { step: '01', title: 'Chuẩn bị bồn tắm thủy lực cá nhân', desc: 'Pha chế khoáng chất và tinh dầu theo sở thích và thể trạng riêng của quý khách.' },
      { step: '02', title: 'Ngâm mình & Massage bọt khí jacuzzi', desc: '40 phút ngâm thư giãn trong làn nước thơm mát với hệ thống sục khí massage cơ thể.' },
      { step: '03', title: 'Dưỡng thể thảo dược & Tráng nước hoa sen', desc: 'Thoa lotion dưỡng thể hữu cơ cao cấp và thưởng thức thức uống dinh dưỡng.' }
    ],
    ritualStepsEn: [
      { step: '01', title: 'Personalized Bath Preparation', desc: 'Minerals and essential oils blended to match your bespoke wellness needs.' },
      { step: '02', title: 'Hydro-Jet Immersion & Blossom Soak', desc: '40 minutes bubbling soak in floral waters with gentle jet massage.' },
      { step: '03', title: 'Organic Body Elixir & Refreshment', desc: 'Application of organic nourishing body lotion with soothing spa refreshments.' }
    ]
  }
];

export const EXPERIENCES_DATA = {
  gastronomy: {
    id: 'gastronomy',
    slug: 'gastronomy',
    icon: Utensils,
    badgeVi: 'Nghệ Thuật Ẩm Thực Michelin',
    badgeEn: 'Michelin-Inspired Gastronomic Art',
    titleVi: 'Ẩm Thực Tinh Hoa DTN',
    titleEn: 'Haute Gastronomy at DTN',
    subtitleVi: 'Bản giao hưởng giữa kỹ thuật nấu ăn kinh điển nước Pháp và nguồn nguyên liệu hữu cơ cao cấp đậm đà phong vị Việt Nam.',
    subtitleEn: 'A symphony of timeless French culinary craft and exquisite local organic ingredients in a breathtaking neoclassical setting.',
    heroImage: 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/30/1132697/321722584_1123230561.jpg',
    stats: [
      { value: '3-Star', labelVi: 'Tiêu Chuẩn Michelin', labelEn: 'Michelin Standards' },
      { value: '450+', labelVi: 'Hầm Vang Grand Cru', labelEn: 'Grand Cru Labels' },
      { value: '100%', labelVi: 'Nguyên Liệu Hữu Cơ', labelEn: 'Organic Terroir' },
      { value: '7-Course', labelVi: 'Hành Trình Vị Giác', labelEn: 'Degustation Odyssey' }
    ],
    highlights: [
      {
        titleVi: "Bàn Tiệc Chef's Table Riêng Biệt",
        titleEn: "Private Chef's Table Experience",
        descVi: 'Tận mắt chiêm ngưỡng Tổng bếp trưởng Michelin biểu diễn kỹ nghệ ẩm thực đương đại với thực đơn 7 món cá nhân hóa.',
        descEn: 'Witness our Executive Chef curate bespoke 7-course seasonal creations right before your eyes in an intimate salon.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        tag: 'Signature'
      },
      {
        titleVi: 'Bộ Sưu Tập Rượu Vang Grand Cru',
        titleEn: 'Grand Cru Sommelier Pairing',
        descVi: 'Hầm rượu vang 450+ nhãn hiệu danh giá từ Bordeaux, Burgundy, Napa Valley được tuyển chọn bởi chuyên gia Sommelier quốc tế.',
        descEn: 'Over 450 prestigious labels from Bordeaux, Burgundy, and Napa Valley curated by world-class certified sommeliers.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        tag: 'Wine Cellar'
      },
      {
        titleVi: 'Tiệc Trà Chiều Hoàng Gia Dát Vàng',
        titleEn: 'Imperial High Tea & Pastry',
        descVi: 'Thưởng thức trà hữu cơ thượng hạng cùng bánh ngọt Pháp thủ công và trứng cá Caviar trong phòng trà phủ vàng lá 24k.',
        descEn: 'Finest single-estate teas paired with French handcrafted pastries and Baeri caviar in our 24k gilded lounge.',
        image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80',
        tag: 'Afternoon Tea'
      }
    ],
    inclusionsVi: [
      'Dịch vụ quản gia ẩm thực riêng phục vụ tại bàn',
      'Được giải thích chi tiết nguồn gốc và câu chuyện từng món ăn',
      'Lựa chọn kết hợp rượu vang Grand Cru cao cấp',
      'Ưu đãi đặc biệt khi đặt tiệc kỷ niệm hoặc tiếp đón khách VIP'
    ],
    inclusionsEn: [
      'Dedicated personal culinary butler service',
      'Tableside presentation of ingredient provenance and culinary stories',
      'Curated Grand Cru wine pairings available',
      'Special privileges for anniversary and VIP celebrations'
    ],
    primaryCtaVi: 'Đặt Bàn Ẩm Thực',
    primaryCtaEn: 'Reserve Dining Table',
    secondaryCtaVi: 'Xem Thực Đơn Chi Tiết',
    secondaryCtaEn: 'Explore Full Menu',
    secondaryUrl: '/our-menu'
  },

  sanctuary: {
    id: 'sanctuary',
    slug: 'sanctuary',
    icon: Sparkles,
    badgeVi: 'Không Gian Tĩnh Dưỡng & Spa',
    badgeEn: 'Holistic Sanctuary & Wellness',
    titleVi: 'Lotus Spa & Trị Liệu Thân Tâm',
    titleEn: 'Lotus Spa & Wellness Sanctuary',
    subtitleVi: 'Thư giãn mọi giác quan với liệu pháp muối Himalaya, xông hơi cẩm thạch Ý và tinh hoa thảo mộc trị liệu cổ truyền phương Đông.',
    subtitleEn: 'Rejuvenate your senses with Himalayan salt chambers, Italian marble steam rituals, and restorative traditional herbal therapies.',
    heroImage: 'https://acihome.vn/uploads/19/spa-area-at-mist-hotel.jpg',
    stats: [
      { value: '100%', labelVi: 'Tinh Dầu Thiên Nhiên', labelEn: 'Pure Botanical Oils' },
      { value: '60-240m', labelVi: 'Liệu Trình Chuyên Sâu', labelEn: 'Bespoke Rituals' },
      { value: '24k Gold', labelVi: 'Trẻ Hóa Hoàng Gia', labelEn: 'Royal Facial Care' },
      { value: 'Private', labelVi: 'Phòng Spa Suite Đôi', labelEn: 'Private Couple Suites' }
    ],
    highlights: [
      {
        titleVi: 'Phòng Trị Liệu Muối Hồng Himalaya',
        titleEn: 'Himalayan Pink Salt Inhalation',
        descVi: 'Không gian tường đá muối phát ion âm tự nhiên với ánh sáng hổ phách ấm áp giúp thanh lọc hệ hô hấp và giải tỏa căng thẳng.',
        descEn: 'Natural negative ion salt chamber with warm amber lighting to detoxify the respiratory tract and restore tranquility.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
        tag: 'Popular',
        packageId: 'salt-therapy'
      },
      {
        titleVi: 'Phòng Xông Hơi Cẩm Thạch & Thủy Liệu',
        titleEn: 'Marble Steam & Hydrotherapy Circuit',
        descVi: 'Hệ thống xông hơi tinh dầu tràm gió và thác nước khoáng ấm giúp giãn cơ, kích thích lưu thông máu và tái tạo năng lượng.',
        descEn: 'Aromatic cajeput steam infused with warm mineral hydrotherapy to soothe muscle tension and boost vitality.',
        image: 'https://hanteco.vn/hinhanh/tintuc/thiet-ke-khu-xong-hoi-spa-chuyen-nghiep-hop-ly-8.jpg',
        tag: 'Detox',
        packageId: 'steam-room'
      },
      {
        titleVi: 'Gói Đánh Thức Năng Lượng Hoàng Gia',
        titleEn: 'The Royal Awakening Full-Day',
        descVi: 'Liệu trình trọn vẹn 4 giờ bao gồm ngâm bồn thảo dược, massage mô sâu bằng đá nóng núi lửa và bữa trưa hữu cơ thanh nhẹ.',
        descEn: 'A 4-hour immersive journey including herbal bath, volcanic hot stone deep-tissue massage, and a light organic lunch.',
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop',
        tag: 'All-Inclusive',
        packageId: 'royal-awakening'
      }
    ],
    inclusionsVi: [
      'Miễn phí thưởng thức trà thảo mộc hoa sen và đồ ăn nhẹ dinh dưỡng',
      'Sử dụng không giới hạn hồ ngâm thủy lực và phòng xông hơi ướt',
      'Tư vấn tình trạng sức khỏe cá nhân trước liệu trình',
      'Phòng thay đồ riêng tư với đầy đủ tiện nghi cao cấp 5 sao'
    ],
    inclusionsEn: [
      'Complimentary organic lotus blossom tea and wellness refreshments',
      'Unlimited access to hydrotherapy vitality pools and steam chambers',
      'Pre-treatment individual health and wellness consultation',
      'Private luxury locker and changing lounge with 5-star amenities'
    ],
    primaryCtaVi: 'Đặt Lịch Trị Liệu',
    primaryCtaEn: 'Book Spa Treatment',
    secondaryCtaVi: 'Xem Gói Wellness Trang Chủ',
    secondaryCtaEn: 'Explore Home Wellness',
    secondaryUrl: '/#wellness'
  },

  celebrations: {
    id: 'celebrations',
    slug: 'celebrations',
    icon: Heart,
    badgeVi: 'Sự Kiện & Tiệc Sang Trọng',
    badgeEn: 'Grand Celebrations & Weddings',
    titleVi: 'Không Gian Sự Kiện Hoàng Gia DTN',
    titleEn: 'Imperial Grand Celebrations & Galas',
    subtitleVi: 'Phòng khiêu vũ Tân cổ điển dát vàng 24k tráng lệ, không gian tiệc ngoài trời đẳng cấp cùng dịch vụ tổ chức tiệc chuẩn mực quốc tế.',
    subtitleEn: 'Gilded 24k gold neoclassical ballroom and scenic open-air terrace paired with bespoke event curation and world-class hospitality.',
    heroImage: 'https://pkphoto.com/wp-content/uploads/2023/06/5O1A4118-scaled-1.jpg',
    stats: [
      { value: '450+', labelVi: 'Sức Chứa Khách', labelEn: 'Guest Capacity' },
      { value: '8m', labelVi: 'Trần Vòm Dát Vàng', labelEn: 'Ceiling Height' },
      { value: '1:1', labelVi: 'Chuyên Viên Sự Kiện', labelEn: 'Dedicated Planner' },
      { value: 'Custom', labelVi: 'Thực Đơn Thiết Kế', labelEn: 'Bespoke Menus' }
    ],
    highlights: [
      {
        titleVi: 'Phòng Đại Tiệc The Grand Ballroom',
        titleEn: 'The Grand Crystal Ballroom',
        descVi: 'Không gian tiệc lộng lẫy trần cao 8m với đèn chùm pha lê Tiệp Khắc nhập khẩu, tường ốp phào chỉ dát vàng và âm thanh hòa nhạc.',
        descEn: 'Opulent 8m-high ballroom adorned with Bohemian crystal chandeliers, gilded moldings, and concert-grade acoustics.',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        tag: 'Ballroom'
      },
      {
        titleVi: 'Sân Thượng Tiệc Hoàng Hôn The Rooftop',
        titleEn: 'The Rooftop Sky Terrace',
        descVi: 'Không gian tiệc cocktail ngoài trời ngắm trọn cảnh hoàng hôn thành phố lộng lẫy, lý tưởng cho tiệc đính hôn và tiệc VIP riêng tư.',
        descEn: 'Scenic open-air terrace overlooking the city skyline, perfect for sunset cocktail soirees and private VIP receptions.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        tag: 'Rooftop'
      },
      {
        titleVi: 'Tiệc Cưới Thiết Kế Độc Bản (Bespoke)',
        titleEn: 'Bespoke Haute Wedding Planning',
        descVi: 'Chuyên gia tổ chức tiệc cưới đồng hành từ khâu ý tưởng, hoa tươi nhập khẩu, kịch bản ánh sáng đến thực đơn chiêu đãi 5 sao.',
        descEn: 'Comprehensive planning with personalized floral decor, lighting choreography, and customized Michelin-grade banquets.',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
        tag: 'Weddings'
      }
    ],
    inclusionsVi: [
      'Chuyên viên tổ chức sự kiện chuyên nghiệp đồng hành 1:1',
      'Hệ thống âm thanh ánh sáng sân khấu và màn hình LED 4K hiện đại',
      'Đội ngũ phục vụ chuẩn phong cách quý tộc với đồng phục nghi lễ',
      'Phòng Suite tân hôn cao cấp kèm rượu sâm panh thượng hạng'
    ],
    inclusionsEn: [
      'Dedicated 1-on-1 certified wedding & event planner',
      'State-of-the-art concert audio-visual setup and 4K LED displays',
      'White-glove ceremonial banquet service staff',
      'Complimentary Bridal Honeymoon Suite with vintage Champagne'
    ],
    primaryCtaVi: 'Yêu Cầu Tư Vấn Sự Kiện',
    primaryCtaEn: 'Request Event Proposal',
    secondaryCtaVi: 'Xem Không Gian Phòng',
    secondaryCtaEn: 'View Room Map',
    secondaryUrl: '/room-map'
  }
};

