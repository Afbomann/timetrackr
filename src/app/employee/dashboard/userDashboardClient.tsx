"use client";

import { TServerActionResponse } from "@/libs/types";
import { workSessionStatusType } from "@prisma/client";
import { useEffect, useState } from "react";
import ConfirmToggleWorkSessionModal from "./(modals)/confirmToggleWorkSessionModal";

export default function UserDashboardClient(props: {
  activeWorkSession: Date | null;
  toggleWorkSessionActiveServer: () => Promise<TServerActionResponse>;
  workSessions: {
    start: Date;
    end: Date | null;
    status: workSessionStatusType;
  }[];
}) {
  const [activeWorkSession] = useState(props.activeWorkSession);
  const [workSessions] = useState(props.workSessions);
  const [workSessionsFiltered, setWorkSessionsFiltered] = useState(
    props.workSessions
  );
  const [workSessionsFilter, setWorkSessionsFilter] = useState("all");
  const [nowDate, setNowDate] = useState(new Date());
  const [modals, setModals] = useState({
    confirmToggleWorkSessionModal: false,
  });

  useEffect(() => {
    switch (workSessionsFilter) {
      case "all":
        setWorkSessionsFiltered(() => workSessions);
        return;
      case "thisWeek":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              getWeekNumber(new Date()) == getWeekNumber(workSession.start)
          )
        );
        return;
      case "thisMonth":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              workSession.start.getMonth() == new Date().getMonth()
          )
        );
        return;
      case "thisYear":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              workSession.start.getFullYear() == new Date().getFullYear()
          )
        );
        return;
      case "previousWeek":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              getWeekNumber(new Date()) - getWeekNumber(workSession.start) == 1
          )
        );
        return;
      case "previousMonth":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              new Date().getMonth() - workSession.start.getMonth() == 1
          )
        );
        return;
      case "previousYear":
        setWorkSessionsFiltered(() =>
          workSessions.filter(
            (workSession) =>
              new Date().getFullYear() - workSession.start.getFullYear() == 1
          )
        );
        return;
    }
  }, [workSessionsFilter, workSessions]);

  useEffect(() => {
    const interval = setInterval(() => setNowDate(() => new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <ConfirmToggleWorkSessionModal
        toggleWorkSessionActiveServer={props.toggleWorkSessionActiveServer}
        activeWorkSession={activeWorkSession ? true : false}
        isOpen={modals.confirmToggleWorkSessionModal}
        onClose={() =>
          setModals(
            (prev) => (prev = { ...prev, confirmToggleWorkSessionModal: false })
          )
        }
      />

      <button
        onClick={() =>
          setModals(
            (prev) => (prev = { ...prev, confirmToggleWorkSessionModal: true })
          )
        }
        className={`${
          activeWorkSession ? "bg-red-400" : "bg-green-400"
        } px-[15px] py-[6px] text-base lg:text-lg mt-[15px]`}
      >
        {activeWorkSession ? "Avslutt arbeidsøkt" : "Start arbeidsøkt"}
      </button>

      {activeWorkSession && (
        <p className="text-base lg:text-lg mt-[5px]">
          {(() => {
            const activeWorkSessionTotalSeconds =
              (nowDate.getTime() - activeWorkSession.getTime()) / 1000;
            const activeWorkSessionHours = Math.floor(
              activeWorkSessionTotalSeconds / 3600
            );
            const activeWorkSessionMinutes = Math.floor(
              (activeWorkSessionTotalSeconds % 3600) / 60
            );
            const activeWorkSessionSeconds = Math.floor(
              activeWorkSessionTotalSeconds % 60
            );

            return `${fixNumber(activeWorkSessionHours)}:${fixNumber(
              activeWorkSessionMinutes
            )}:${fixNumber(activeWorkSessionSeconds)}`;
          })()}
        </p>
      )}

      <div className="flex gap-[10px] mt-[20px] flex-wrap">
        <button
          onClick={async () => setWorkSessionsFilter(() => "all")}
          className={`${
            workSessionsFilter == "all" ? "bg-slate-200" : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Alle
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "thisWeek")}
          className={`${
            workSessionsFilter == "thisWeek" ? "bg-slate-200" : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Denne uken
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "thisMonth")}
          className={`${
            workSessionsFilter == "thisMonth" ? "bg-slate-200" : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Denne måneden
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "thisYear")}
          className={`${
            workSessionsFilter == "thisYear" ? "bg-slate-200" : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Dette året
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "previousWeek")}
          className={`${
            workSessionsFilter == "previousWeek"
              ? "bg-slate-200"
              : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Forrige uke
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "previousMonth")}
          className={`${
            workSessionsFilter == "previousMonth"
              ? "bg-slate-200"
              : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Forrige måned
        </button>
        <button
          onClick={async () => setWorkSessionsFilter(() => "previousYear")}
          className={`${
            workSessionsFilter == "previousYear"
              ? "bg-slate-200"
              : "bg-slate-100"
          } px-[20px] py-[6px] text-sm lg:text-base`}
        >
          Forrige år
        </button>
      </div>

      <div className="mt-[10px] flex gap-[15px]">
        <p className="text-sm lg:text-base">
          Arbeidsøkter totalt:{" "}
          {
            workSessionsFiltered.filter(
              (workSession) => workSession.status == "ended"
            ).length
          }
        </p>
        <p className="text-sm lg:text-base">
          Arbeidstimer totalt:{" "}
          {(() => {
            let workSessionTotalHours = 0;

            workSessionsFiltered
              .filter((workSession) => workSession.status == "ended")
              .forEach((workSession) => {
                const workSessionTotalSeconds =
                  (workSession.end!.getTime() - workSession.start.getTime()) /
                  1000;
                workSessionTotalHours += workSessionTotalSeconds / 3600;
              });

            return workSessionTotalHours.toFixed(1);
          })()}
        </p>
      </div>

      <table className="mt-[10px] mb-[5dvh]">
        <thead>
          <tr>
            <th className="text-sm lg:text-base text-left py-[5px]">Start</th>
            <th className="text-sm lg:text-base text-left pl-[10px]">Slutt</th>
            <th className="text-sm lg:text-base text-right pl-[10px]">
              Timer totalt
            </th>
          </tr>
        </thead>
        <tbody>
          {workSessions.length == 0 && (
            <tr className="border-t">
              <td className="text-sm lg:text-base text-left py-[5px]">
                Du har ingen arbeidsøkter enda.
              </td>
            </tr>
          )}

          {workSessionsFiltered.length == 0 && workSessions.length > 0 && (
            <tr className="border-t">
              <td className="text-sm lg:text-base text-left py-[5px]">
                Ingen resultater.
              </td>
            </tr>
          )}

          {workSessionsFiltered.length > 0 &&
            workSessionsFiltered
              .filter((workSession) => workSession.status == "ended")
              .map((workSession) => {
                const workSessionTotalSeconds =
                  (workSession.end!.getTime() - workSession.start.getTime()) /
                  1000;
                const workSessionTotalHours = workSessionTotalSeconds / 3600;

                return (
                  <tr
                    className="border-t"
                    key={`${workSession.start}-${workSession.end}`}
                  >
                    <td className="text-sm lg:text-base text-left py-[5px]">
                      {workSession.start.toLocaleString()}
                    </td>
                    <td className="text-sm lg:text-base text-left pl-[10px]">
                      {workSession.end!.toLocaleString()}
                    </td>
                    <td className="text-sm lg:text-base text-right pl-[10px]">
                      {workSessionTotalHours.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </>
  );
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const startDayOfWeek = startOfYear.getDay() || 7;

  const firstThursday = new Date(startOfYear);
  firstThursday.setDate(startOfYear.getDate() + (4 - startDayOfWeek));

  const startOfFirstWeek = new Date(firstThursday);
  startOfFirstWeek.setDate(
    firstThursday.getDate() - (firstThursday.getDay() || 7) + 1
  );

  const daysSinceStartOfFirstWeek =
    (date.getTime() - startOfFirstWeek.getTime()) / (24 * 60 * 60 * 1000);

  const weekNumber = Math.ceil((daysSinceStartOfFirstWeek + 1) / 7);
  return weekNumber;
}

function fixNumber(number: number): string {
  return number >= 10 ? number.toString() : "0" + number.toString();
}
