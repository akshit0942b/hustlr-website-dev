import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
  {
    id: 1,
    title: "Personal Info",
  },
  {
    id: 2,
    title: "Skills Assessment",
  },
  {
    id: 3,
    title: "Project Proposal",
  },
  {
    id: 4,
    title: "Final Review",
  },
];

export default function VettingTimeline() {
  return (
    <Timeline defaultValue={3} orientation="horizontal" className="dark">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
