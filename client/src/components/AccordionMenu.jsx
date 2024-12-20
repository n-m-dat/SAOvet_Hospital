import { useState } from "react";

const AccordionMenu = () => {
  // Dùng useState để quản lý trạng thái mở/đóng của các mục Accordion
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {/* Mục 1 */}
        <div className="border rounded-md">
          <div
            className="bg-blue-500 text-white p-4 cursor-pointer"
            onClick={() => toggleAccordion(0)}
          >
            <h2 className="font-semibold">Mục 1</h2>
          </div>
          {openIndex === 0 && (
            <div className="bg-gray-100 p-4">
              <p>Đây là nội dung của mục 1.</p>
            </div>
          )}
        </div>

        {/* Mục 2 */}
        <div className="border rounded-md">
          <div
            className="bg-blue-500 text-white p-4 cursor-pointer"
            onClick={() => toggleAccordion(1)}
          >
            <h2 className="font-semibold">Mục 2</h2>
          </div>
          {openIndex === 1 && (
            <div className="bg-gray-100 p-4">
              <p>Đây là nội dung của mục 2.</p>
            </div>
          )}
        </div>

        {/* Mục 3 */}
        <div className="border rounded-md">
          <div
            className="bg-blue-500 text-white p-4 cursor-pointer"
            onClick={() => toggleAccordion(2)}
          >
            <h2 className="font-semibold">Mục 3</h2>
          </div>
          {openIndex === 2 && (
            <div className="bg-gray-100 p-4">
              <p>Đây là nội dung của mục 3.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionMenu;
