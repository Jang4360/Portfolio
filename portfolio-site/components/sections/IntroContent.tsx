"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlurText } from "../ui/BlurText";
import { InteractiveSelector, SelectorOption } from "../ui/InteractiveSelector";
import { FaServer, FaLightbulb, FaHourglassStart } from "react-icons/fa";

const values = [
    {
        number: "하나,",
        title: "Reliability",
        subtitle: "운영 안정성",
        items: [
            {
                heading: "구조화 로그 기반 중앙 모니터링 체계 구축",
                desc: "모든 로그를 JSON으로 구조화하고, 요청 추적·에러 분류·비즈니스 이벤트를 하나의 플랫폼(OpenSearch)에서 조회·분석할 수 있는 체계를 설계했습니다. 이후 트래픽 증가 시 점진적 확장이 가능한 구조를 마련했습니다.",
            },
            {
                heading: "장애 대응을 위한 Fallback 설계와 런타임 검증",
                desc: "크리티컬한 장애 포인트에 Fallback 로직을 설계하고, 런타임 테스트로 시스템이 예상대로 동작하는지 사전 검증하는 방식을 실천해 왔습니다.",
            },
        ],
    },
    {
        number: "둘,",
        title: "Decision",
        subtitle: "기술 선택",
        items: [
            {
                heading: "트레이드오프 기반 ADR 작성 습관",
                desc: "기술적 의사결정이 필요할 때마다 선택지별 장단점을 문서화하는 ADR을 작성해 왔습니다. 총 10건의 ADR을 통해 감이 아닌 근거 기반의 기술 선택을 체화했습니다.",
            },
            {
                heading: "\"왜 이 기술인가\"를 설명할 수 있는 개발자",
                desc: "프로젝트마다 마주친 기술 선택지에서 요구사항·제약·확장성을 기준으로 판단하고, 그 과정을 팀과 공유해 왔습니다. 선택의 이유를 설명할 수 있는 것이 곧 설계 역량이라고 생각합니다.",
            },
        ],
    },
    {
        number: "셋,",
        title: "Consistency",
        subtitle: "꾸준함",
        items: [
            {
                heading: "기술 블로그 운영",
                desc: "프로젝트에서 마주친 문제와 해결 과정을 블로그에 기록해 왔습니다. \"왜 이런 문제가 발생했고, 어떤 판단을 했는지\"를 중심으로 사고 과정을 글로 남기고 있습니다.",
            },
            {
                heading: "TIL 작성",
                desc: "매일의 학습 내용을 TIL로 기록하며 작은 깨달음도 축적하는 것을 실천해 왔습니다. 꾸준히 성장하는 개발자의 기본기는 기록에서 시작한다고 믿고 있습니다.",
            },
        ],
    },
];

export default function IntroContent() {
    const [heroDone, setHeroDone] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const options: SelectorOption[] = [
        {
            title: values[0].title,
            description: values[0].subtitle,
            icon: <FaServer size={20} className="text-white" />,
            bgImage: "/images/background/reliability.jpg?v=1",
            details: (
                <div className="space-y-4 mt-2 w-full">
                    {values[0].items.map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-3 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">
                            {item.heading && (
                                <h4 className="text-white font-bold text-[18px] mb-1">{item.heading}</h4>
                            )}
                            <p className="text-gray-200 text-sm leading-relaxed opacity-90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: values[1].title,
            description: values[1].subtitle,
            icon: <FaLightbulb size={20} className="text-white" />,
            bgImage: "/images/background/decision.jpg?v=1",
            details: (
                <div className="space-y-4 mt-2 w-full">
                    {values[1].items.map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-3 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">
                            {item.heading && (
                                <h4 className="text-white font-bold text-[18px] mb-1">{item.heading}</h4>
                            )}
                            <p className="text-gray-200 text-sm leading-relaxed opacity-90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: values[2].title,
            description: values[2].subtitle,
            icon: <FaHourglassStart size={20} className="text-white" />,
            bgImage: "/images/background/consistency.jpg?v=1",
            details: (
                <div className="space-y-4 mt-2 w-full">
                    {values[2].items.map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-3 rounded-lg backdrop-blur-md border border-white/10 shadow-lg">
                            {item.heading && (
                                <h4 className="text-white font-bold text-[18px] mb-1">{item.heading}</h4>
                            )}
                            <p className="text-gray-200 text-sm leading-relaxed opacity-90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 md:gap-8 pt-4 pb-4">
            {/* Hero Text with BlurText Effect */}
            <div className="w-full max-w-6xl px-4 flex items-center justify-center shrink-0 mb-4 md:mb-8">
                {mounted && (
                    <BlurText
                        text="측정 가능한 가치를 만드는 개발자"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        stepDuration={0.4}
                        onAnimationComplete={() => setHeroDone(true)}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-[#E1E1E1]"
                        animationFrom={{ filter: 'blur(12px)', opacity: 0, y: -40 }}
                        animationTo={[
                            { filter: 'blur(6px)', opacity: 0.5, y: 4 },
                            { filter: 'blur(0px)', opacity: 1, y: 0 },
                        ]}
                        easing={[0.25, 0.1, 0.25, 1]}
                    />
                )}
            </div>

            {/* Card Carousel with blur-in animation */}
            <motion.div
                className="w-full max-w-[1200px] px-4 flex-1 min-h-0 flex flex-col justify-start"
                initial={{ filter: 'blur(10px)', opacity: 0, y: 30 }}
                animate={heroDone ? { filter: 'blur(0px)', opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <InteractiveSelector options={options} />
            </motion.div>
        </div>
    );
}
