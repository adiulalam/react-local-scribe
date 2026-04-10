import { defineStepper, type Get } from "@stepperize/react";
import { type StepStatus, useStepItemContext } from "@stepperize/react/primitives";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Orientation = "horizontal" | "vertical";
type LabelOrientation = "horizontal" | "vertical";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Stepper, ...stepperDefinition } = defineStepper(
  {
    id: "step-1",
    title: "Step 1",
    description: "First step description",
  },
  {
    id: "step-2",
    title: "Step 2",
    description: "Second step description",
  },
  {
    id: "step-3",
    title: "Step 3",
    description: "Third step description",
  }
);

const StepperTriggerWrapper = () => {
  const item = useStepItemContext();
  const isInactive = item.status === "inactive";

  return (
    <Stepper.Trigger
      render={(domProps) => (
        <Button
          className="rounded-full"
          variant={isInactive ? "secondary" : "default"}
          size="icon"
          {...domProps}
        >
          <Stepper.Indicator>{item.index + 1}</Stepper.Indicator>
        </Button>
      )}
    />
  );
};

const StepperTitleWrapper = ({ title }: { title: string }) => {
  return (
    <Stepper.Title
      render={(domProps) => (
        <h4 className="text-sm font-medium" {...domProps}>
          {title}
        </h4>
      )}
    />
  );
};

const StepperDescriptionWrapper = ({ description }: { description?: string }) => {
  if (!description) return null;
  return (
    <Stepper.Description
      render={(domProps) => (
        <p className="text-muted-foreground text-xs" {...domProps}>
          {description}
        </p>
      )}
    />
  );
};

const StepperSeparator = ({
  status,
  isLast,
  orientation,
  labelOrientation,
}: {
  status: StepStatus;
  isLast: boolean;
  orientation: Orientation;
  labelOrientation: LabelOrientation;
}) => {
  if (isLast) return null;

  const isVerticalLabel = orientation === "horizontal" && labelOrientation === "vertical";

  return (
    <Stepper.Separator
      orientation={orientation}
      data-status={status}
      className={cn(
        "bg-muted data-[status=success]:bg-primary transition-all duration-300 ease-in-out data-disabled:opacity-50",
        orientation === "horizontal" && "h-0.5 min-w-4 flex-1 self-center",
        orientation === "vertical" && "h-full w-0.5",
        isVerticalLabel &&
          "absolute top-5 right-[calc(-50%+20px)] left-[calc(50%+30px)] block shrink-0"
      )}
    />
  );
};

export function StepperWithVariants() {
  const [orientation, setOrientation] = React.useState<Orientation>("horizontal");
  const [labelOrientation, setLabelOrientation] = React.useState<LabelOrientation>("horizontal");

  const isVerticalLabel = orientation === "horizontal" && labelOrientation === "vertical";

  return (
    <div className="w-full space-y-8">
      {/* Controls */}
      <div className="bg-muted/50 flex w-max flex-wrap gap-8 rounded-lg border p-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Orientation</Label>
          <RadioGroup
            value={orientation}
            onValueChange={(value) => setOrientation(value as Orientation)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="horizontal" id="h-orient" />
              <Label htmlFor="h-orient" className="font-normal">
                Horizontal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vertical" id="v-orient" />
              <Label htmlFor="v-orient" className="font-normal">
                Vertical
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label
            className={cn(
              "text-sm font-medium",
              orientation === "vertical" && "text-muted-foreground"
            )}
          >
            Label Orientation
          </Label>
          <RadioGroup
            value={labelOrientation}
            onValueChange={(value) => setLabelOrientation(value as LabelOrientation)}
            disabled={orientation === "vertical"}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="horizontal" id="h-label" />
              <Label
                htmlFor="h-label"
                className={cn("font-normal", orientation === "vertical" && "text-muted-foreground")}
              >
                Horizontal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vertical" id="v-label" />
              <Label
                htmlFor="v-label"
                className={cn("font-normal", orientation === "vertical" && "text-muted-foreground")}
              >
                Vertical
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Stepper */}
      <Stepper.Root className="w-full space-y-4" orientation={orientation}>
        {({ stepper }) => (
          <>
            <Stepper.List
              className={cn(
                "flex list-none gap-2",
                orientation === "horizontal" && "flex-row items-center justify-between",
                orientation === "vertical" && "flex-col"
              )}
            >
              {stepper.state.all.map((stepData, index) => {
                const currentIndex = stepper.state.current.index;
                const status =
                  index < currentIndex ? "success" : index === currentIndex ? "active" : "inactive";
                const isLast = index === stepper.state.all.length - 1;

                if (orientation === "vertical") {
                  return (
                    <React.Fragment key={stepData.id}>
                      <Stepper.Item
                        step={stepData.id}
                        className="group peer relative flex shrink-0 items-center gap-2"
                      >
                        <StepperTriggerWrapper />
                        <div className="flex flex-col items-start gap-1">
                          <StepperTitleWrapper title={stepData.title} />
                          <StepperDescriptionWrapper description={stepData.description} />
                        </div>
                      </Stepper.Item>
                      <div className="flex gap-4">
                        {!isLast && (
                          <div className="flex justify-center self-stretch ps-[calc(var(--spacing)*4.5-1px)]">
                            <StepperSeparator
                              status={status}
                              isLast={isLast}
                              orientation={orientation}
                              labelOrientation={labelOrientation}
                            />
                          </div>
                        )}
                        <div className="my-3 flex-1 ps-4">
                          <Content id={stepData.id as Get.Id<typeof stepperDefinition.steps>} />
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                if (isVerticalLabel) {
                  return (
                    <Stepper.Item
                      key={stepData.id}
                      step={stepData.id}
                      className="group peer relative flex w-full flex-col items-center justify-center gap-2"
                    >
                      <StepperTriggerWrapper />
                      <StepperSeparator
                        status={status}
                        isLast={isLast}
                        orientation={orientation}
                        labelOrientation={labelOrientation}
                      />
                      <div className="flex flex-col items-center gap-1 text-center">
                        <StepperTitleWrapper title={stepData.title} />
                        <StepperDescriptionWrapper description={stepData.description} />
                      </div>
                    </Stepper.Item>
                  );
                }

                // Horizontal with horizontal labels
                return (
                  <React.Fragment key={stepData.id}>
                    <Stepper.Item
                      key={stepData.id}
                      step={stepData.id}
                      className="group peer relative flex shrink-0 items-center gap-2"
                    >
                      <StepperTriggerWrapper />
                      <div className="flex flex-col items-start gap-1">
                        <StepperTitleWrapper title={stepData.title} />
                        <StepperDescriptionWrapper description={stepData.description} />
                      </div>
                    </Stepper.Item>
                    <StepperSeparator
                      key={`separator-${stepData.id}`}
                      status={status}
                      isLast={isLast}
                      orientation={orientation}
                      labelOrientation={labelOrientation}
                    />
                  </React.Fragment>
                );
              })}
            </Stepper.List>

            {orientation === "horizontal" &&
              stepper.flow.switch({
                "step-1": (data) => <Content id={data.id} />,
                "step-2": (data) => <Content id={data.id} />,
                "step-3": (data) => <Content id={data.id} />,
              })}

            <Stepper.Actions className="flex justify-end gap-4">
              {!stepper.state.isLast && (
                <Stepper.Prev
                  render={(domProps) => (
                    <Button type="button" variant="secondary" {...domProps}>
                      Previous
                    </Button>
                  )}
                />
              )}
              {stepper.state.isLast ? (
                <Button type="button" onClick={() => stepper.navigation.reset()}>
                  Reset
                </Button>
              ) : (
                <Stepper.Next
                  render={(domProps) => (
                    <Button type="button" {...domProps}>
                      Next
                    </Button>
                  )}
                />
              )}
            </Stepper.Actions>
          </>
        )}
      </Stepper.Root>
    </div>
  );
}

const Content = ({ id }: { id: Get.Id<typeof stepperDefinition.steps> }) => {
  return (
    <Stepper.Content
      step={id}
      render={(props) => (
        <div
          {...props}
          className="bg-secondary text-secondary-foreground h-37.5 content-center rounded border p-8"
        >
          <p className="text-xl font-normal">Content for {id}</p>
        </div>
      )}
    />
  );
};
