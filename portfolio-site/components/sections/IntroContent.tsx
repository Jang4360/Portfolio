"use client";

import React from "react";
import { motion } from "framer-motion";

const values = [
    {
        number: "하나,",
        title: "Flexible",
        subtitle: "유연한 사고",
        items: [
            {
                heading: "OO시사동아리 34기 활동",
                desc: "매주 인기 토픽으로 뽑은 한 가지 시사 주제를 가지고 다양한 학과 사람들과 모여 토론 활동을 합니다. 각자의 경험 차이에 따라 바라보는 시각의 해상도가 다름을 배웠습니다.",
            },
            {
                heading: "여름방학, 국제 교류 프로그램 활동",
                desc: "외국인 재학생들을 대상으로 한국과 타 국가의 문화 교류 멘토로 활동했습니다. 문화적 차이로 발생하는 갈등의 차이를 줄이려는 것이 아니라 즐길하는 역량을 기를 수 있었던 경험입니다.",
            },
        ],
    },
    {
        number: "둘,",
        title: "Challenge",
        subtitle: "끊임없는 도전",
        items: [
            {
                heading: "제 OO대 총학생회 OO 선거 활동",
                desc: "내성적인 평소 제 성과 다르게, 새로운 사람들과 교류하여 공동의 목표를 달성했던 경험입니다. 익숙하지 않은 영역에도 도전하는 것을 두려워하지 않는 바탕이 되었습니다.",
            },
            {
                heading: "교내 미혼모를 위한 방과후, 사이드 프로젝트",
                desc: "아동발달심리학 강의 내용을 미혼모 학생들을 위한 무료 사이드 감의로 방학 때 진행해 왔습니다. 실제 사례를 수집하여 각종의 이해를 위한 자료로 재구성했고, 다양한 환경적 제약을 극복 미혼모 학생들을 위한 연계 서비스를 만들어 1인으로 운영해 본 경험이 있습니다.",
            },
        ],
    },
    {
        number: "셋,",
        title: "Together",
        subtitle: "나보다 우리",
        items: [
            {
                heading: "4년 간 43번의 팀플",
                desc: "학과 특성 상 미디어 콘텐츠 제작하는 과제가 많았습니다. 주로 기획과 편집을 담당하면서, 다른 사람들의 아이디어를 모아 한 페 만드는 과정을 통해 협업의 중요성을 깨달았습니다.",
            },
            {
                heading: "",
                desc: "팀 활동이 적었던 초반 학기에는 의견 충돌이 항상 갈등처럼 느껴졌지만, 결국이 대립하는 것은 우리 모두가 함께 잘 만들고 싶어서 발생하는 현상임을 알았습니다. 의견 충돌은 자신의 입장만 생각할 때 발생하는 현상임을 깨달으면서 팀에서 중요한 것은 우리의 입장에서 생각하는 것임을 배웠습니다.",
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
                                        <span className="text-white/40 mt-0.5 text-[8px]">&#9654;</span>
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
