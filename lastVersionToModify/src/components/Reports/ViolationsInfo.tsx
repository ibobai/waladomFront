import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, AlertCircle, Shield } from "lucide-react";

const ViolationsInfo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getViolationsList = () => {
    switch (i18n.language) {
      case "ar":
        return (
          <div className="text-right" dir="rtl">
            <h3 className="text-xl font-bold mb-4">
              قائمة الانتهاكات التي يمكن الإبلاغ عنها في وُلاضَّمْ
            </h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">
                  ١. التحريض العنصري والتمييز القَبَلي
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    مقاطع فيديو أو تسجيلات صوتية تدعو إلى استهداف مناطق أو
                    مجموعات على أساس عِرقي.
                  </li>
                  <li>
                    التحريض على قتل المواطنين أو تهجيرهم بسبب انتمائهم القَبَلي.
                  </li>
                  <li>دعوات لمقاطعة أو عزل أفراد القبائل على أساس عرقي.</li>
                  <li>
                    خطابات كراهية صادرة عن جهات رسمية أو شخصيات مؤثرة تحرض ضد
                    قبائل البقَّارة والأبَّالة.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  ٢. الهجمات العسكرية والاستهداف القَبَلي
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    قصف جوي يستهدف قرى أو مناطق مدنية على أساس قبلي، مع توثيق
                    التاريخ والموقع الدقيق.
                  </li>
                  <li>
                    استهداف المدنيين العُزَّل بالهجمات العسكرية، وعدد الضحايا
                    وأسماؤهم إن أمكن.
                  </li>
                  <li>تدمير الممتلكات الخاصة أو القرى بسبب الانتماء القبلي.</li>
                  <li>
                    فرض حصار أو منع دخول المساعدات الإنسانية للمناطق المتضررة
                    بسبب انتمائها القَبَلي.
                  </li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ نحن لا نعتبر قصف الطيران على المواقع العسكرية أو استهداف أي
                  جهة عسكرية انتهاكًا.
                </p>
                <p className="mt-2 text-gray-600">
                  وُلاضَّمْ منظمة تُعنى بحماية المدنيين وليس لها علاقة بالحرب
                  الدائرة بين الجيش والدعم السريع.
                </p>
                <p className="mt-2 text-gray-600">
                  لن نقبل أي فيديو لمعارك عسكرية أو استهداف مواقع عسكرية، سواء
                  من قبل الجيش أو الدعم السريع.{" "}
                </p>
                <p className="mt-2 text-gray-600">
                  لن نقبل أيضًا توثيق مقتل أي عسكري أو جندي كأنه انتهاك، لأن
                  القتال بين الأطراف العسكرية هو جزء من الحرب وليس استهدافًا
                  للمدنيين.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  ٣. انتهاكات الحقوق المدنية
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>رفض استخراج وثائق رسمية بسبب الانتماء القَبَلي.</li>
                  <li>اعتقالات تعسفية على أساس قبلي دون أي مسوغات قانونية.</li>
                  <li>
                    التعذيب داخل السجون أو المعسكرات بسبب الهوية القَبَلية.
                  </li>
                  <li>
                    الفصل التعسفي من الوظائف أو حرمان الطلاب من الدراسة بسبب
                    الانتماء القَبَلي.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  ٤. العنف الجسدي والتهديدات
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    الاعتداءات الجسدية على الأفراد بسبب انتمائهم القَبَلي.
                  </li>
                  <li>تهديدات بالقتل أو التعرض للأذى بسبب العرق أو القبيلة.</li>
                  <li>
                    حالات الاختفاء القسري أو التهجير القسري لسكان القرى بسبب
                    هويتهم القَبَلية.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  ٥. جرائم الحرب والانتهاكات الكبرى
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    حالات الإبادة الجماعية أو استهداف المدنيين بشكل مباشر.
                  </li>
                  <li>توثيق المجازر ضد قبائل البقَّارة والأبَّالة.</li>
                  <li>
                    توثيق استخدام أسلحة محرمة دوليًا ضد القرى أو التجمعات
                    السكانية.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        );
      case "fr":
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">
              Liste des Violations Acceptées par WULADAM
            </h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">
                  1. Incitation au Racisme et Discrimination Tribale
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Vidéos ou enregistrements audio appelant au ciblage de zones
                    ou de groupes sur une base ethnique.
                  </li>
                  <li>
                    Appels au meurtre ou à l'expulsion de citoyens en raison de
                    leur appartenance tribale.
                  </li>
                  <li>
                    Appels au boycott ou à l'isolement de membres de tribus sur
                    une base ethnique.
                  </li>
                  <li>
                    Discours de haine de la part d'officiels ou de personnalités
                    influentes contre les tribus Baggara et Abbala.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  2. Attaques Militaires et Ciblage Tribal
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Bombardements aériens ciblant des villages ou zones civiles
                    sur une base tribale, avec date et lieu documentés.
                  </li>
                  <li>
                    Ciblage de civils non armés, avec nombre de victimes et noms
                    si possible.
                  </li>
                  <li>
                    Destruction de propriétés privées ou de villages en raison
                    de l'appartenance tribale.
                  </li>
                  <li>
                    Blocus ou refus d'aide humanitaire aux zones affectées en
                    raison de leur identité tribale.
                  </li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ Nous ne considérons pas les frappes aériennes sur des sites
                  militaires ou le ciblage d'entités militaires comme des
                  violations.
                </p>
                <p className="mt-2 text-gray-600">
                  Waladom est une organisation dédiée à la protection des civils
                  et n'a aucun lien avec la guerre en cours entre l'armée et les
                  FSR.
                </p>
                <p className="mt-2 text-gray-600">
                  Nous n'accepterons aucune vidéo de combats militaires ou
                  d'attaques sur des sites militaires, qu'elles soient menées
                  par l'armée ou les FSR.
                </p>
                <p className="mt-2 text-gray-600">
                  Nous n'accepterons pas non plus la documentation de la mort de
                  tout soldat ou personnel militaire comme une violation, car
                  les combats entre forces militaires font partie de la guerre
                  et ne constituent pas un ciblage de civils.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  3. Violations des Droits Civils
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Refus de délivrer des documents officiels en raison de
                    l'appartenance tribale.
                  </li>
                  <li>
                    Arrestations arbitraires sur base tribale sans justification
                    légale.
                  </li>
                  <li>
                    Torture dans les prisons ou camps en raison de l'identité
                    tribale.
                  </li>
                  <li>
                    Licenciements arbitraires ou privation d'éducation en raison
                    de l'appartenance tribale.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  4. Violences physiques et menaces
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Agressions physiques contre des individus en raison de leur
                    appartenance tribale.
                  </li>
                  <li>
                    Menaces de mort ou de violences en raison de l'ethnie ou de
                    la tribu.
                  </li>
                  <li>
                    Cas de disparitions forcées ou de déplacements forcés de
                    populations villageoises en raison de leur identité tribale.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  5. Crimes de guerre et violations majeures
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Cas de génocide ou de ciblage direct des civils.</li>
                  <li>
                    Documentation des massacres contre les tribus Baggara et
                    Abbala.
                  </li>
                  <li>
                    Documentation de l'utilisation d'armes interdites
                    internationalement contre les villages ou les populations.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        );
      default: // English
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">
              List of Violations Accepted by WULADAM
            </h3>
            <div className="space-y-6">
              <section>
                <h4 className="text-lg font-semibold mb-2">
                  1. Racial Incitement and Tribal Discrimination
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Videos or audio recordings calling for targeting areas or
                    groups based on ethnicity.
                  </li>
                  <li>
                    Incitement to kill or displace citizens due to their tribal
                    affiliation.
                  </li>
                  <li>
                    Calls for boycott or isolation of tribal members based on
                    ethnicity.
                  </li>
                  <li>
                    Hate speech from officials or influential figures against
                    Baggara and Abbala tribes.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  2. Military Attacks and Tribal Targeting
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Aerial bombings targeting villages or civilian areas based
                    on tribal affiliation, with documented date and location.
                  </li>
                  <li>
                    Targeting of unarmed civilians, with number of victims and
                    names if available.
                  </li>
                  <li>
                    Destruction of private property or villages due to tribal
                    affiliation.
                  </li>
                  <li>
                    Blockade or denial of humanitarian aid to affected areas
                    based on tribal identity.
                  </li>
                </ul>
              </section>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="text-red-700">
                  ❌ We do not consider airstrikes on military sites or
                  targeting any military entity as violations.
                </p>
                <p className="mt-2 text-gray-600">
                  Waladom is an organization dedicated to protecting civilians
                  and has no involvement in the ongoing war between the army and
                  the RSF.
                </p>
                <p className="mt-2 text-gray-600">
                  We will not accept any videos of military battles or attacks
                  on military sites, whether carried out by the army or the RSF.
                </p>
                <p className="mt-2 text-gray-600">
                  We will also not accept documentation of the killing of any
                  soldier or military personnel as a violation, because combat
                  between military forces is part of the war and not a
                  civilian-targeted attack.
                </p>
              </div>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  3. Civil Rights Violations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Denial of official documents due to tribal affiliation.
                  </li>
                  <li>
                    Arbitrary arrests based on tribal identity without legal
                    justification.
                  </li>
                  <li>Torture in prisons or camps due to tribal identity.</li>
                  <li>
                    Arbitrary dismissal from jobs or denial of education due to
                    tribal affiliation.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  4. Physical Violence and Threats
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>
                    Physical assaults on individuals due to their tribal
                    affiliation.
                  </li>
                  <li>
                    Death threats or threats of harm based on ethnicity or
                    tribe.
                  </li>
                  <li>
                    Cases of forced disappearances or forced displacement of
                    villagers due to their tribal identity.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="text-lg font-semibold mb-2">
                  5. War Crimes and Major Violations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Cases of genocide or direct targeting of civilians.</li>
                  <li>
                    Documentation of massacres against Baggara and Abbala
                    tribes.
                  </li>
                  <li>
                    Documentation of the use of internationally banned weapons
                    against villages or civilian populations.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200"
      >
        <div className="flex items-center">
          <Shield className="w-6 h-6 text-waladom-green mr-2" />
          <h2 className="text-lg font-semibold">
            {t("reports.acceptedViolations")}
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && <div className="p-6">{getViolationsList()}</div>}
    </div>
  );
};

export default ViolationsInfo;
