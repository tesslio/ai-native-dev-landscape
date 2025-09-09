"use client";

import { Icon } from "../icons";
import { ToolsData } from "@/type/tools-type";
import { cx } from "cva";
import { useState } from "react";
import { getConsistentColor } from "@/util/get-consistent-color";
import { PopupCard } from "../popup-card";
import Logo from "../logo";
import { TableTooltip } from "../tabel-tooltip";
import { useGlobaleContext } from "@/components/globale/globale-context";

export default function GridCard({
  categories,
  title,
  description,
}: {
  categories: ToolsData["domains"][0]["categories"];
  title: string;
  description: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { activeTags } = useGlobaleContext();

  return (
    <div className="flex flex-col w-full border-b first:border-t first:lg:border-t-0 first:rounded-t-lg first:lg:rounded-t-none overflow-hidden lg:last:border-b-0 border-[#C9C3B9]">
      <div className="p-4 lg:p-6 border-x border-[#C9C3B9] lg:border-x-0 border-b  w-full text-[27px] flex items-start lg:items-center gap-2">
        <div
          className="size-4 shrink-0 rounded-full mt-0.5 lg:mt-0"
          style={{
            backgroundColor: getConsistentColor(title),
          }}
        />
        <p className="heading-xl lg:heading-2xl w-full">{title} </p>
        <TableTooltip text={description}>
          <Icon name="infoBlack" className="cursor-pointer size-5" />
        </TableTooltip>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {categories
          .sort((a, b) => a.level - b.level)
          .map((category) => {
            if (category.tools.length === 0) return null;
            const filteredTools = activeTags.includes("all")
              ? category.tools
              : category.tools.filter((tool) =>
                  tool.tags?.some((tag) => activeTags.includes(tag))
                );
            if (filteredTools.length === 0) return null;
            return {
              category,
              filteredTools,
            } as const;
          })
          .filter(
            (
              item
            ): item is {
              category: (typeof categories)[0];
              filteredTools: (typeof categories)[0]["tools"];
            } => item !== null
          )
          .map(({ category, filteredTools }, visibleIndex) => {
            const filtredToolsLength = filteredTools.length;
            return (
              <div
                key={category.name}
                className={cx(
                  "border-[#C9C3B9] border border-t-0 lg:border-l-0 last:border-b-0 last:lg:border-b ",
                  {
                    "lg:border-r-0 ": visibleIndex % 3 === 2,
                    "lg:!border-b-0 ":
                      visibleIndex >=
                      categories.length - (categories.length % 3 || 3),
                  }
                )}
              >
                <div
                  className={cx(
                    "text-lg py-4 px-6 border-t-0 lg:border-b border-b border-[#C9C3B9]  flex justify-between items-center",
                    {
                      "border-t-0 ": visibleIndex > 2,
                    }
                  )}
                >
                  <p className="lg:ml-8 heading-xl">{category.name} </p>
                  <p className="font-inter text-sm font-normal leading-[130%] text-black/30">
                    {filtredToolsLength !== category.tools.length
                      ? `${filtredToolsLength} of ${category.tools.length}`
                      : category.tools.length}
                  </p>
                </div>
                <div className="grid grid-cols-4 auto-rows-auto items-stretch gap-px">
                  {filteredTools
                    .sort((a, b) => (b.popular === true ? 1 : -1))
                    .slice(0, expanded ? category.tools.length : 11)
                    .map((tool) => (
                      <PopupCard
                        key={tool.name}
                        tool={tool}
                        category={category.name}
                        domain={title}
                      >
                        <div className="text-sm flex-1 outline outline-[#C9C3B9] h-[120px]  ">
                          <div className="items-center flex flex-col gap-2 transition-all duration-300 px-2 py-4 overflow-hidden">
                            <Logo tool={tool} />
                            <p className="uppercase font-dm-mono text-[10px] xl:text-xs leading-[150%] max-w-[100px] text-center tracking-[1.54px] line-clamp-2 overflow-hidden text-ellipsis">
                              {tool.name}
                            </p>
                          </div>
                        </div>
                      </PopupCard>
                    ))}
                  {category.tools.length > 11 && (
                    <button
                      className="body text-sm cursor-pointer flex-1 items-center justify-center flex outline outline-[#C9C3B9] h-[120px] px-2 py-4"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <p className="text-center">
                        {expanded ? "Show less" : "Show more"}
                        {!expanded && (
                          <>
                            <br />
                            <span className="text-xs">
                              [{category.tools.length - 11}]
                            </span>
                          </>
                        )}
                      </p>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
