require 'pry'
require 'csv'

# returns true false for ambiguity of zip
def check_zip(zip)
end

# returns rate area for a given zip
def find_rate_area(zip)
  ### Refactor?
  rate_areas = []
  CSV.foreach("./zips.csv") do |row|
    if row[0] == zip.to_s
      rate_areas << row[4]
    end
  end
  ###
  rate_areas = rate_areas.uniq
  if rate_areas.length == 1
    return rate_areas[0]
  else
    return false
  end
end

# finds silver plans in plans.csv for a rate area, returns plans as an array
def find_silver_plans_for_area(rate_area)
  silver_plans = []
  CSV.foreach("./plans.csv") do |row|
    if row[2] == "Silver" && row[4] == rate_area
      silver_plans << row[3].to_f
    end
  end
  return silver_plans.uniq.sort
end

# Returns string of slcp (second lowest cost plan) in the collection of plans for an area
def find_slcp(silver_plans)
  return silver_plans[1].to_s
end


rate_area = find_rate_area(36750)
silver_plans = find_silver_plans_for_area(rate_area)
print silver_plans
print silver_plans.length