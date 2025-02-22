import React from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      {/* Flag Video Banner */}
      <div className="relative h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://waladom.s3.amazonaws.com/media/report/proofs/54e5927FP/report1-54e5927FP.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-center">
            {t("about.title")}
          </h1>

          <p className="text-base sm:text-xl md:text-3xl lg:text-3xl max-w-5xl text-center text-gray-200 break-words">
            {t("about.description")}
          </p>

          <div className="absolute bottom-10 animate-bounce">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission Section */}
          <section className="mb-24">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                {t("about.mission.title")}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {t("about.mission.description")}
              </p>
              <p className="text-xl text-gray-600">
                {t("about.mission.support")}
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              {t("about.values.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center">
              {t("about.values.intro")}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {["justice", "unity", "freedom"].map((value) => (
                <div
                  key={value}
                  className="bg-gray-50 p-8 rounded-2xl transform hover:scale-105 transition-transform"
                >
                  <div className="text-4xl mb-4">
                    {value === "justice" && "⚖️"}
                    {value === "unity" && "🤝"}
                    {value === "freedom" && "🕊️"}
                  </div>
                  <p className="text-lg text-gray-700">
                    {t(`about.values.${value}`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="mb-24 bg-waladom-green text-white -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">
                {t("about.vision.title")}
              </h2>
              <p className="text-xl">{t("about.vision.description")}</p>
            </div>
          </section>

          {/* Core Principles Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              {t("about.principles.title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-waladom-green">
                    {t(`about.principles.${index}.title`)}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {t(`about.principles.${index}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Flag Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              {t("about.flag.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-4xl mx-auto">
              {t("about.flag.description")}
            </p>

            {/* Colors */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                {t("about.flag.colors.title")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {["red", "white", "yellow", "green", "black"].map((color) => (
                  <div
                    key={color}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-full mx-auto mb-4 ${
                        color === "white"
                          ? "bg-white border-2 border-gray-200"
                          : color === "black"
                          ? "bg-black"
                          : `bg-${color}-500`
                      }`}
                    />
                    <p className="text-center text-gray-700">
                      {t(`about.flag.colors.${color}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Symbols */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-center">
                {t("about.flag.symbols.title")}
              </h3>
              <div className="grid md:grid-cols-2 gap-12">
                {/* Horse */}
                <div className="bg-black text-white p-8 rounded-2xl">
                  <h4 className="text-xl font-medium mb-4">
                    {t("about.flag.symbols.horse.title")}
                  </h4>
                  <p className="text-gray-200">
                    {t("about.flag.symbols.horse.description")}
                  </p>
                </div>

                {/* Stars */}
                <div className="bg-waladom-green text-white p-8 rounded-2xl">
                  <h4 className="text-xl font-medium mb-4">
                    {t("about.flag.symbols.stars.title")}
                  </h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-2xl">⭐</span>
                        <p>{t(`about.flag.symbols.stars.star${index}`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Join Us Section */}
          <section className="text-center bg-gray-50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              {t("about.join.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t("about.join.description")}
            </p>
            <div className="space-y-6">
              <p className="text-2xl font-medium text-waladom-green">
                🚨 {t("about.join.launch")}
              </p>
              <p className="text-2xl font-medium text-waladom-green">
                📢 {t("about.join.support")}
              </p>
            </div>
            <p className="text-3xl font-bold text-waladom-green mt-12 animate-pulse">
              {t("about.join.unite")}
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
