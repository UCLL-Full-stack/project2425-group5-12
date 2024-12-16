import { Tag } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "next-i18next";

type Props = {
  taskTags: Array<Tag>;
  existingTags: Array<Tag>;
  addNewTag: ({ title }: { title: string }) => void;
  setTaskTags: Dispatch<SetStateAction<Array<Tag>>>;
};

const TagForm: React.FC<Props> = ({
  taskTags,
  existingTags,
  addNewTag,
  setTaskTags,
}: Props) => {
  const { t } = useTranslation();
  const [tagSearchTitle, setTagSearchTitle] = useState<string>("");

  return (
    <div className="p-6 bg-gray-50 shadow rounded-lg max-w-md mx-auto space-y-4">
      <label className="block font-semibold text-gray-700">
        {t("tags.form.tags")}
        <div className="flex mt-2 space-x-2">
          <input
            type="text"
            value={tagSearchTitle}
            onChange={(e) => setTagSearchTitle(e.target.value)}
            placeholder={t("tags.form.search")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div>
            {existingTags
              .filter(
                (tag) => !taskTags.some((tag2) => tag2.title === tag.title)
              )
              .filter((tag) => tag.title.toLowerCase() === tagSearchTitle)
              .length !== 1 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addNewTag({ title: tagSearchTitle });
                  setTagSearchTitle("");
                }}
                className="px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
              >
                {t("tags.form.addTag")}
              </button>
            )}
          </div>
        </div>
      </label>

      <div className="border-t pt-4">
        <p className="font-medium text-gray-600 mb-2">
          {t("tags.form.options")}
        </p>
        <ul className="space-y-2">
          {existingTags
            .filter((tag) => !taskTags.some((tag2) => tag2.title === tag.title))
            .filter((tag) =>
              tag.title.toLowerCase().includes(tagSearchTitle.toLowerCase())
            )
            .map((tag) => (
              <li
                key={tag.id}
                onClick={() => setTaskTags([...taskTags, tag])}
                className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                {tag.title}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TagForm;
