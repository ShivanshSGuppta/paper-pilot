function difficultyLabel(value: string) {
  if (value === "easy") return "Easy";
  if (value === "hard") return "Challenging";
  return "Moderate";
}

export function ExamPaper({
  result,
  showAnswerKey = true
}: {
  result: {
    title: string;
    schoolName: string;
    subject: string;
    className: string;
    durationMinutes: number;
    maximumMarks: number;
    instructions?: string[];
    sections: Array<{
      title: string;
      instruction: string;
      questions: Array<{ text: string; difficulty: string; marks: number; type: string }>;
    }>;
    answerKey?: Array<{ questionRef?: string; answer: string }>;
  };
  showAnswerKey?: boolean;
}) {
  const instructions = result.instructions?.length
    ? result.instructions
    : ["All questions are compulsory unless stated otherwise."];

  return (
    <div className="exam-paper mx-auto w-full max-w-[860px] rounded-[28px] bg-white px-5 py-6 shadow-[0_18px_34px_rgba(0,0,0,0.09)] sm:px-8 sm:py-8">
      <div className="text-center">
        <h2 className="text-[22px] font-semibold tracking-tight text-[#212121] sm:text-[32px]">
          {result.schoolName}
        </h2>
        <div className="mt-2 space-y-1 text-[13px] font-medium text-[#2a2a2a] sm:text-[17px]">
          <div>Subject: {result.subject}</div>
          <div>Class: {result.className}</div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-6 text-[12px] text-[#202020] sm:text-[14px]">
        <div>Time Allowed: {result.durationMinutes} minutes</div>
        <div>Maximum Marks: {result.maximumMarks}</div>
      </div>

      <div className="mt-4 text-[12px] leading-6 text-[#222] sm:text-[14px]">
        {instructions[0]}
      </div>

      <div className="mt-5 space-y-1 text-[12px] text-[#202020] sm:text-[14px]">
        <div>
          Name: <span className="inline-block min-w-[120px] border-b border-[#3a3a3a]" />
        </div>
        <div>
          Roll Number: <span className="inline-block min-w-[92px] border-b border-[#3a3a3a]" />
        </div>
        <div>
          Class: {result.className} Section: <span className="inline-block min-w-[68px] border-b border-[#3a3a3a]" />
        </div>
      </div>

      <div className="mt-10 space-y-8 text-[#191919]">
        {result.sections.map((section, sectionIndex) => (
          <section key={section.title}>
            <h3 className="text-center text-[18px] font-semibold sm:text-[24px]">
              {section.title || `Section ${String.fromCharCode(65 + sectionIndex)}`}
            </h3>
            <div className="mt-4 text-[11px] italic text-[#6f6f6f] sm:text-[13px]">
              {section.instruction}
            </div>

            <ol className="mt-5 space-y-2.5 pl-5 text-[12px] leading-6 sm:text-[14px] sm:leading-7">
              {section.questions.map((question, index) => (
                <li key={`${section.title}-${index}`} className="pl-1">
                  [{difficultyLabel(question.difficulty)}] {question.text} [{question.marks} Marks]
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="mt-8 text-[13px] font-semibold text-[#191919]">End of Question Paper</div>

      {showAnswerKey && result.answerKey?.length ? (
        <section className="mt-8 border-t border-[#efefef] pt-6">
          <h3 className="text-[18px] font-semibold text-[#202020]">Answer Key:</h3>
          <ol className="mt-4 space-y-2.5 pl-5 text-[12px] leading-6 text-[#202020] sm:text-[14px] sm:leading-7">
            {result.answerKey.map((item, index) => (
              <li key={item.questionRef ?? index}>{item.answer}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
