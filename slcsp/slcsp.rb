require 'csv'

# returns all rate areas for a given zip in an array
def collect_rate_areas(zip, path_to_zips_file)
  rate_areas = []
  # NOTE: What is a more performant way to search for this information?
  CSV.foreach(path_to_zips_file, headers:true) do |row|
    if row["zipcode"] == zip.to_s
      rate_areas << row["rate_area"]
    end
  end
  return rate_areas
end

# returns rate area for a given zip if there is a sole rate area, otherwise returns false
def find_rate_area(zip, path_to_zips_file)
  rate_areas = collect_rate_areas(zip, path_to_zips_file).uniq
  if rate_areas.length == 1
    return rate_areas[0]
  else
    return false
  end
end

# finds silver plans from plans.csv for a rate area
# returns an array containing all of those plans, sorted from low to high cost
def find_silver_plans_for_area(rate_area, path_to_plans_file)
  silver_plans = []
  # NOTE: What is a more performant way to search for this information?
  CSV.foreach(path_to_plans_file, headers:true) do |row|
    if row["metal_level"] == "Silver" && row["rate_area"] == rate_area
      silver_plans << row["rate"].to_f
    end
  end
  return silver_plans.uniq.sort
end

# returns string of slcp (second lowest cost plan) in the collection of plans for an area
def find_slcp(silver_plans)
  return silver_plans[1].to_s
end

# for each line in the slcsp.csv file, strings previous method to calculate the lowest slscp for the given zipcode
def fill_csv_data(path_to_zips_file, path_to_plans_file, path_to_slcsp_file)
  csv_data = [["zipcode","rate"]]
  CSV.foreach(path_to_slcsp_file, headers:true) do |row|
    if rate_area = find_rate_area(row["zipcode"], path_to_zips_file)
      silver_plans = find_silver_plans_for_area(rate_area, path_to_plans_file)
      csv_data << [row["zipcode"], find_slcp(silver_plans)]
    else
      # NOTE: would prefer an alternative to ""
      csv_data << [row["zipcode"], ""]
    end
  end
  return csv_data
end

# writes csv data to the file
def write_result(csv_data, path_to_slcsp_file)
  CSV.open(path_to_slcsp_file, "wb") do |csv|
    csv_data.each do |row|
      csv << row
    end
  end
end

# driver method for the program
def driver(path_to_zips_file, path_to_plans_file, path_to_slcsp_file)
  csv_data = fill_csv_data(path_to_zips_file, path_to_plans_file, path_to_slcsp_file)
  write_result(csv_data, path_to_slcsp_file)
end

driver("./zips.csv", "./plans.csv", "./testslcsp.csv")