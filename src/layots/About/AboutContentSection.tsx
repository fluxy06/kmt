import { motion } from "framer-motion";
import Contact from "../../shared/Buttons/Contact";

const whyUsCards = [
  {
    title: "Скорость как стандарт",
    description:
      "От согласования макета до монтажа — мы действуем быстро, потому что знаем: ваше промо не ждет.",
  },
  {
    title: "Выверенная геометрия",
    description:
      "Наш производственный контроль гарантирует, что каждый миллиметр изображения будет четким, а цвета — сочными даже под прямым солнцем.",
  },
  {
    title: "Прочность и надежность",
    description:
      "Мы используем материалы, устойчивые к любой погоде. Ваша реклама будет выглядеть безупречно весь срок размещения.",
  },
  {
    title: "Прозрачность и отчетность",
    description:
      "Вы точно знаете, на что идет ваш бюджет. Фотоотчет с монтажа — обязательный пункт в нашей работе.",
  },
];

const AboutContentSection = () => {
  return (
    <>
      <section className="mt-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="font-['Montserrat_Alternates'] text-[clamp(34px,4.4vw,68px)] leading-[1.02] font-black theme-text"
        >
          Почему мы?
        </motion.h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {whyUsCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -5, boxShadow: "0 18px 28px rgba(2,6,23,0.25)" }}
              className="theme-surface min-h-[278px] rounded-[30px] px-6 py-7"
            >
              <h3 className="theme-text max-w-[14ch] break-words font-['Montserrat_Alternates'] text-[clamp(24px,2.1vw,38px)] leading-[1.08] font-black">
                {card.title}
              </h3>

              <p className="theme-subtext mt-6 break-words font-['Montserrat'] text-[clamp(16px,1.05vw,20px)] leading-[1.35]">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-10 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45 }}
          className="font-['Montserrat_Alternates'] text-[clamp(34px,4.4vw,68px)] leading-[1.02] font-black theme-text"
        >
          Наша команда
        </motion.h2>

        <div className="mt-6 grid items-stretch gap-7 lg:grid-cols-[1fr_1.25fr]">
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: "0 20px 34px rgba(2,6,23,0.26)" }}
            className="theme-surface rounded-[30px] px-7 py-8"
          >
            <h3 className="theme-text max-w-[16ch] break-words font-['Montserrat_Alternates'] text-[clamp(24px,2.5vw,42px)] leading-[1.12] font-black">
              Профи, которые знают городскую среду изнутри
            </h3>

            <p className="theme-subtext mt-8 break-words font-['Montserrat'] text-[clamp(16px,1.08vw,21px)] leading-[1.35]">
              В нашей команде нет теоретиков. Здесь работают менеджеры с опытом в B2B-продажах, дизайнеры,
              мыслящие большими форматами, и технологи, знающие все о свойствах материалов. Мы понимаем не
              только эстетику, но и физику монтажа, и юридическую сторону размещения.
            </p>
          </motion.article>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="theme-text text-center font-['Montserrat_Alternates'] text-[clamp(24px,4vw,42px)] leading-[1.08] font-black break-words">
              Уже готовы к запуску?
              <br />
              Свяжитесь с нами
            </div>

            <div className="mt-10 flex w-full justify-center">
              <Contact
                label="Сделайте шаг вперед вместе с нами!"
                width={{ min: "220px", preferred: "100%", max: "720px" }}
                height={{ min: "58px", preferred: "5.2vw", max: "86px" }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutContentSection;
