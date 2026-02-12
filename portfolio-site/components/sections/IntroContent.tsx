"use client";

import React from "react";
import { motion } from "framer-motion";

const values = [
    {
        number: "하나,",
        title: "Reliability",
        subtitle: "운영 안정성",
        items: [
            {
                heading: "구조화 로그 기반 중앙 모니터링 체계 구축",
                desc: "Logstash Encoder + MDC를 활용해 모든 로그를 JSON으로 구조화하고 traceId·userId·logType·event 등 필드 기반으로 장애 분석과 비즈니스 이벤트 모니터링을 단일 플랫폼(OpenSearch)에서 처리할 수 있는 체계를 설계했습니다. JSON 로그 + Filebeat → OpenSearch 구조로 시작해, 이후 Logstash·S3 백업·Kafka 연동 등 점진적 확장이 가능한 발판을 마련했습니다.",
            },
            {
                heading: "장애 상황에서의 Fallback 설계와 런타임 검증",
                desc: "크리티컬한 장애 포인트에 Fallback 로직을 설계하고 런타임 테스트를 통해 시스템이 예상대로 동작하는지를 사전에 검증하는 방식을 실천해 왔습니다. 배포 환경 변화로 인코딩 파이프라인이 중단된 사례에서는 0.5초 테스트 영상으로 실제 작동 여부를 런타임 검증하고 GPU → CPU Fallback을 적용해 환경에 능동적으로 적응하는 시스템을 구축한 경험이 있습니다.",
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
                desc: "팀 프로젝트에서 기술적 의사결정이 필요할 때마다 Architecture Decision Record(ADR)를 작성해 왔습니다. 선택지별 장단점과 트레이드오프를 문서화하고, 왜 이 기술을 선택했는지 근거를 남기는 것을 원칙으로 삼았습니다. 지금까지 총 10건의 ADR을 작성하며 감이 아닌 근거 기반의 기술 선택을 체화했습니다.",
            },
            {
                heading: "\"왜 이 기술인가\"를 설명할 수 있는 개발자",
                desc: "롱폴링 vs SSE vs WebSocket, SQL 필터링 vs AI 전수 탐색, 정적 파일 매핑 vs DB Source of Truth 등 프로젝트마다 마주친 선택지에서 요구사항·제약·확장성을 기준으로 판단하고, 그 과정을 팀과 공유해 왔습니다. 기술 선택의 이유를 설명할 수 있는 것이 곧 설계 역량이라고 생각합니다.",
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
                desc: "프로젝트에서 마주친 문제와 해결 과정, 새롭게 학습한 개념을 블로그에 정리해 왔습니다. 단순 정리가 아니라 \"왜 이런 문제가 발생했고, 어떤 판단을 했는지\"를 중심으로 기록하며 사고 과정을 글로 남기는 습관을 유지하고 있습니다.",
            },
            {
                heading: "TIL 작성",
                desc: "매일의 학습 내용을 TIL로 기록하며 작은 깨달음도 축적하는 것을 실천해 왔습니다. 하루 단위의 기록이 쌓여 프로젝트 회고와 기술 선택의 근거가 되었고 꾸준히 성장하는 개발자의 기본기는 기록에서 시작한다고 믿고 있습니다.",
            },
        ],
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const } },
};

export default function IntroContent() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 px-6"
        >
            {values.map((value, idx) => (
                <motion.div key={idx} variants={itemVariants} className="space-y-5">
                    <div>
                        <p className="text-white/30 text-xs mb-2 uppercase" style={{ letterSpacing: "0.15em" }}>{value.number}</p>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
                            {value.title}
                        </h3>
                        <p className="text-white/40 text-sm mt-2">{value.subtitle}</p>
                    </div>

                    <div className="w-8 h-[1px] bg-white/20" />

                    <div className="space-y-4">
                        {value.items.map((item, iIdx) => (
                            <div key={iIdx}>
                                {item.heading && (
                                    <p className="text-white/60 text-xs font-bold mb-1 flex items-start gap-1.5 uppercase" style={{ letterSpacing: "0.05em" }}>
                                        <span className="text-white/40 mt-0.5 text-[8px]">&#9660;</span>
                                        {item.heading}
                                    </p>
                                )}
                                <p className="text-white/35 text-xs leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
